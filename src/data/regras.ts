/**
 * UPA+ — Regras de negócio centralizadas (protótipo acadêmico / TCC).
 *
 * Toda regra quantitativa do aplicativo deve residir neste arquivo.
 * Nenhum limite de ocupação, peso de score ou rótulo de status deve ser
 * duplicado em componentes de interface.
 *
 * Ver docs/regras-de-negocio.md para a documentação completa.
 */

/** RN01 — Percentual = ocupação atual / capacidade × 100. */
export function percentualOcupacao(ocupacao: number, capacidade: number): number {
  if (!capacidade || capacidade <= 0) return 0;
  return Math.round((Math.max(0, ocupacao) / capacidade) * 100);
}

/** RN02/RN03 — Ocupação e capacidade não podem ser negativas. */
export function normalizarOcupacao(valor: number): number {
  return Math.max(0, Math.round(Number.isFinite(valor) ? valor : 0));
}

/**
 * RN04 — Limites do indicador visual (complementar ao número).
 * A ocupação NÃO é limitada a 100%: acima disso o estado é superlotação.
 */
export const LIMITES_OCUPACAO = {
  baixaAte: 50,
  moderadaAte: 79,
  altaAte: 100,
} as const;

export type NivelOcupacao = "baixa" | "moderada" | "alta" | "superlotada";

export function nivelOcupacao(pct: number): NivelOcupacao {
  if (pct <= LIMITES_OCUPACAO.baixaAte) return "baixa";
  if (pct <= LIMITES_OCUPACAO.moderadaAte) return "moderada";
  if (pct <= LIMITES_OCUPACAO.altaAte) return "alta";
  return "superlotada";
}

/**
 * RN14 — Score de recomendação computacional.
 * score = (percentual de ocupação × PESO_OCUPACAO) + (distância_km × 10 × PESO_DISTANCIA)
 * Menor score = opção considerada mais adequada segundo os dados disponíveis.
 *
 * O score NÃO constitui recomendação médica e não garante atendimento mais rápido.
 */
export const SCORE_PESOS = { ocupacao: 0.6, distancia: 0.4 } as const;

export function scoreRecomendacao(pct: number, distanciaKm: number): number {
  return pct * SCORE_PESOS.ocupacao + distanciaKm * 10 * SCORE_PESOS.distancia;
}

/**
 * RN09 — Origem do dado de ocupação deve ser sempre identificável.
 * "api" está reservado para futura integração com fonte oficial autorizada
 * (não implementada neste protótipo).
 */
export type OrigemDado = "manual" | "simulada" | "api";

export const ORIGEM_LABEL: Record<OrigemDado, string> = {
  manual: "Atualizado manualmente pelo gestor",
  simulada: "Dados simulados para demonstração acadêmica",
  api: "Integração oficial (não disponível neste protótipo)",
};

export const ORIGEM_CURTA: Record<OrigemDado, string> = {
  manual: "Gestor",
  simulada: "Simulado",
  api: "Oficial",
};

/** Aviso obrigatório de dados não oficiais. */
export const AVISO_DADOS_SIMULADOS =
  "Dados simulados para demonstração acadêmica. O UPA+ não está conectado às UPAs.";

export const AVISO_RECOMENDACAO =
  "Sugestão calculada com base em ocupação e distância. Não é recomendação médica.";

/** RN05 — Toda informação de ocupação precisa de contexto temporal. */
export function dataHoraCompleta(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Escopo do MVP: entradas de navegação e funcionalidades opcionais. */
export const FEATURE_FLAGS = {
  /** /avaliar preservada como funcionalidade futura, fora da navegação principal. */
  avaliacoesNaNavegacao: false,
  /** /admin acessível por link direto, não como aba do cidadão. */
  adminNaNavegacao: false,
  /** Atualização simulada de ocupação (demonstração). */
  simulacaoOcupacao: true,
} as const;
