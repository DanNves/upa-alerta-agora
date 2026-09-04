/**
 * Camada de acesso aos dados reais (Lovable Cloud / Postgres).
 *
 * Responsabilidade exclusiva: ler e gravar registros e converter as linhas do
 * banco para os tipos já usados pelas telas (`UPA`, `Evento`).
 * NENHUMA regra de negócio vive aqui — nível de ocupação, cores e score de
 * recomendação continuam em `src/data/regras.ts`.
 */
import { supabase } from "./client";
import type { Evento, Servico, UPA } from "@/data/upas";

type LinhaAvaliacao = {
  upa_id: string | null;
  nota: number | null;
  tempo_real_min: number | null;
  comentario: string | null;
  criado_em: string | null;
};

type LinhaHistorico = {
  upa_id: string | null;
  ocupacao: number | null;
  registrado_em: string | null;
};

function rotuloHora(iso: string): string {
  return `${new Date(iso).getHours().toString().padStart(2, "0")}h`;
}

/** Histórico de demonstração quando o banco ainda não tem registros da unidade. */
function historicoDerivado(target: number): { hora: string; ocupacao: number }[] {
  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date();
    d.setHours(d.getHours() - (11 - i));
    const pico = i >= 4 && i <= 8 ? 1 : 0.7;
    const jitter = (i * 13) % 17;
    return {
      hora: `${d.getHours().toString().padStart(2, "0")}h`,
      ocupacao: Math.max(10, Math.round(target * pico - 10 + jitter)),
    };
  });
}

/** Lê as unidades com serviços vinculados, avaliações e histórico de ocupação. */
export async function buscarUpas(): Promise<UPA[]> {
  const [upasRes, vinculosRes, avaliacoesRes, historicoRes] = await Promise.all([
    supabase.from("upas").select("*").order("nome"),
    supabase.from("upa_servicos").select("upa_id, servicos(nome)"),
    supabase
      .from("avaliacoes")
      .select("upa_id, nota, tempo_real_min, comentario, criado_em")
      .order("criado_em", { ascending: false }),
    supabase
      .from("historico_ocupacao")
      .select("upa_id, ocupacao, registrado_em")
      .order("registrado_em", { ascending: true }),
  ]);

  if (upasRes.error) throw upasRes.error;
  const linhas = upasRes.data ?? [];
  if (linhas.length === 0) throw new Error("Nenhuma unidade retornada pelo banco.");

  const servicosPorUpa = new Map<string, Servico[]>();
  for (const v of (vinculosRes.data ?? []) as { upa_id: string | null; servicos: { nome: string } | null }[]) {
    if (!v.upa_id || !v.servicos?.nome) continue;
    const atual = servicosPorUpa.get(v.upa_id) ?? [];
    atual.push(v.servicos.nome as Servico);
    servicosPorUpa.set(v.upa_id, atual);
  }

  const avaliacoesPorUpa = new Map<string, UPA["avaliacoes"]>();
  for (const a of (avaliacoesRes.data ?? []) as LinhaAvaliacao[]) {
    if (!a.upa_id) continue;
    const atual = avaliacoesPorUpa.get(a.upa_id) ?? [];
    atual.push({
      nota: a.nota ?? 0,
      tempo_real_min: a.tempo_real_min ?? 0,
      comentario: a.comentario ?? "Sem comentário.",
      criado_em: a.criado_em ?? new Date().toISOString(),
    });
    avaliacoesPorUpa.set(a.upa_id, atual);
  }

  const historicoPorUpa = new Map<string, { hora: string; ocupacao: number }[]>();
  for (const h of (historicoRes.data ?? []) as LinhaHistorico[]) {
    if (!h.upa_id || h.ocupacao == null) continue;
    const atual = historicoPorUpa.get(h.upa_id) ?? [];
    atual.push({
      hora: rotuloHora(h.registrado_em ?? new Date().toISOString()),
      ocupacao: h.ocupacao,
    });
    historicoPorUpa.set(h.upa_id, atual.slice(-12));
  }

  return linhas.map((u) => ({
    id: u.id,
    nome: u.nome,
    endereco: u.endereco,
    bairro: u.bairro,
    cidade: u.cidade,
    estado: u.estado,
    cep: u.cep,
    latitude: u.latitude,
    longitude: u.longitude,
    telefone: u.telefone ?? "",
    capacidade_max: u.capacidade_max,
    ocupacao_atual: u.ocupacao_atual,
    tempo_estimado: u.tempo_estimado ?? 0,
    aberta: u.aberta ?? true,
    referencia: u.referencia ?? "",
    servicos: servicosPorUpa.get(u.id) ?? [],
    atualizado_em: u.atualizado_em ?? new Date().toISOString(),
    avaliacoes: avaliacoesPorUpa.get(u.id) ?? [],
    historico:
      historicoPorUpa.get(u.id)?.length === 12
        ? historicoPorUpa.get(u.id)!
        : historicoDerivado(u.ocupacao_atual),
  }));
}

/** Lê as campanhas com as unidades participantes. */
export async function buscarEventos(): Promise<Evento[]> {
  const { data, error } = await supabase
    .from("eventos")
    .select("*")
    .order("data_inicio", { ascending: false });
  if (error) throw error;

  return (data ?? []).map((e) => ({
    id: e.id,
    titulo: e.titulo,
    descricao: e.descricao ?? "",
    data_inicio: e.data_inicio,
    data_fim: e.data_fim ?? e.data_inicio,
    upa_ids: (e.upa_ids ?? []) as string[],
    icone: e.icone ?? "📅",
  }));
}

/** Grava uma avaliação de atendimento. */
export async function inserirAvaliacao(entrada: {
  upaId: string;
  nota: number;
  tempoRealMin: number;
  comentario: string;
}): Promise<void> {
  const { error } = await supabase.from("avaliacoes").insert({
    upa_id: entrada.upaId,
    nota: entrada.nota,
    tempo_real_min: entrada.tempoRealMin,
    comentario: entrada.comentario,
  });
  if (error) throw error;
}

/** Registra um ponto de histórico de ocupação. */
export async function inserirHistoricoOcupacao(upaId: string, ocupacao: number): Promise<void> {
  const { error } = await supabase
    .from("historico_ocupacao")
    .insert({ upa_id: upaId, ocupacao });
  if (error) throw error;
}

/** Atualiza os campos operacionais de uma unidade (painel do gestor). */
export async function atualizarUpaOperacional(
  upaId: string,
  patch: { ocupacao_atual?: number; tempo_estimado?: number; aberta?: boolean },
): Promise<void> {
  const { error } = await supabase
    .from("upas")
    .update({ ...patch, atualizado_em: new Date().toISOString() })
    .eq("id", upaId);
  if (error) throw error;
}
