/**
 * UPA+ — Camada única de busca, filtros e ordenação.
 *
 * Todas as telas (mapa, busca) consomem `aplicarFiltros` para que os filtros
 * realmente alterem os resultados apresentados e possam ser combinados.
 * Nenhuma tela deve reimplementar ordenação ou filtragem.
 */

import { distanciaKm, type Servico, type UPA } from "./upas";
import { nivelOcupacao, percentualOcupacao, scoreRecomendacao } from "./regras";

export type Ordenacao = "recomendado" | "proxima" | "ocupacao" | "tempo" | "avaliacao";

export type FilterState = {
  /** RN08 — ordenação padrão usa o score de recomendação computacional. */
  ordenar: Ordenacao;
  /** Serviços exigidos simultaneamente (RN19). */
  servicos: Servico[];
  apenasAbertas: boolean;
  apenasBaixaOcupacao: boolean;
};

export const FILTRO_PADRAO: FilterState = {
  ordenar: "recomendado",
  servicos: [],
  apenasAbertas: false,
  apenasBaixaOcupacao: false,
};

export type UpaResultado = {
  upa: UPA;
  dist: number;
  pct: number;
  media: number;
  score: number;
};

export function mediaAvaliacoes(upa: UPA): number {
  if (!upa.avaliacoes.length) return 0;
  return upa.avaliacoes.reduce((a, b) => a + b.nota, 0) / upa.avaliacoes.length;
}

/** Verdadeiro quando algum filtro/busca está alterando a lista padrão. */
export function filtrosAtivos(filter: FilterState, termo = "", servicosExtra: Servico[] = []) {
  return (
    filter.servicos.length > 0 ||
    servicosExtra.length > 0 ||
    filter.apenasAbertas ||
    filter.apenasBaixaOcupacao ||
    filter.ordenar !== FILTRO_PADRAO.ordenar ||
    termo.trim().length > 0
  );
}

export function aplicarFiltros(opts: {
  upas: UPA[];
  userLoc: { lat: number; lng: number };
  filter: FilterState;
  /** Texto livre: nome, bairro, cidade ou serviço. */
  termo?: string;
  /** Serviços derivados da necessidade selecionada (basta um deles). */
  servicosNecessidade?: Servico[];
}): UpaResultado[] {
  const { upas, userLoc, filter } = opts;
  const q = (opts.termo ?? "").trim().toLowerCase();
  const necessidade = opts.servicosNecessidade ?? [];

  const resultados = upas
    .filter((u) => (filter.apenasAbertas ? u.aberta : true))
    // Serviços do painel de filtros: a unidade precisa oferecer TODOS.
    .filter((u) => filter.servicos.every((s) => u.servicos.includes(s)))
    // Necessidade selecionada: basta oferecer ALGUM dos serviços relacionados.
    .filter((u) => (necessidade.length ? necessidade.some((s) => u.servicos.includes(s)) : true))
    .filter((u) =>
      filter.apenasBaixaOcupacao
        ? nivelOcupacao(percentualOcupacao(u.ocupacao_atual, u.capacidade_max)) === "baixa"
        : true,
    )
    .filter((u) =>
      q
        ? u.nome.toLowerCase().includes(q) ||
          u.bairro.toLowerCase().includes(q) ||
          u.cidade.toLowerCase().includes(q) ||
          u.servicos.some((s) => s.toLowerCase().includes(q))
        : true,
    )
    .map((u) => {
      const dist = distanciaKm(userLoc, { lat: u.latitude, lng: u.longitude });
      const pct = percentualOcupacao(u.ocupacao_atual, u.capacidade_max);
      return { upa: u, dist, pct, media: mediaAvaliacoes(u), score: scoreRecomendacao(pct, dist) };
    });

  const cmp: Record<Ordenacao, (a: UpaResultado, b: UpaResultado) => number> = {
    recomendado: (a, b) => a.score - b.score,
    proxima: (a, b) => a.dist - b.dist,
    ocupacao: (a, b) => a.pct - b.pct,
    tempo: (a, b) => a.upa.tempo_estimado - b.upa.tempo_estimado,
    avaliacao: (a, b) => b.media - a.media,
  };

  // Empates resolvidos pelo score (comportamento estável e documentado).
  return resultados.sort((a, b) => cmp[filter.ordenar](a, b) || a.score - b.score);
}
