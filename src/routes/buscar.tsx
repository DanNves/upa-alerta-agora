import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MapPin, Clock, Navigation, Search, SlidersHorizontal } from "lucide-react";
import { useStore } from "@/data/store";
import { mapsUrl, origemDado, type Servico } from "@/data/upas";
import { aplicarFiltros, filtrosAtivos } from "@/data/filtros";
import { AVISO_RECOMENDACAO, ORIGEM_CURTA, percentualOcupacao } from "@/data/regras";
import { StatusBadge } from "@/components/StatusBadge";
import { FilterSheet } from "@/components/FilterSheet";
import { BottomNav } from "@/components/BottomNav";

export const Route = createFileRoute("/buscar")({
  head: () => ({
    meta: [
      { title: "Buscar UPA por nome, bairro ou serviço | UPA+" },
      {
        name: "description",
        content:
          "Busque UPAs de Salvador por nome, bairro ou serviço e compare ocupação, capacidade e distância.",
      },
      { property: "og:title", content: "Buscar UPA | UPA+" },
      {
        property: "og:description",
        content: "Encontre UPAs por nome, bairro ou serviço e compare ocupação e distância.",
      },
    ],
  }),
  component: BuscarScreen,
});

type Necessidade = {
  id: string;
  label: string;
  emoji: string;
  servicos: Servico[];
};

const NECESSIDADES: Necessidade[] = [
  { id: "febre", label: "Febre / Gripe", emoji: "🤒", servicos: ["Clínico Geral", "Teste Rápido"] },
  { id: "trauma", label: "Dor / Trauma", emoji: "🤕", servicos: ["Clínico Geral", "Raio-X", "Ortopedia"] },
  { id: "crianca", label: "Criança", emoji: "👶", servicos: ["Pediatria"] },
  { id: "teste", label: "Teste Rápido", emoji: "🧪", servicos: ["Teste Rápido"] },
  { id: "vacina", label: "Vacinação", emoji: "💉", servicos: ["Vacinação"] },
  { id: "exame", label: "Exame", emoji: "🩸", servicos: ["Exames"] },
  { id: "urgencia", label: "Urgência", emoji: "🚑", servicos: ["Clínico Geral", "Raio-X"] },
  { id: "respiracao", label: "Respiração", emoji: "🫁", servicos: ["Nebulização", "Clínico Geral"] },
];

const ORDEM_LABEL: Record<string, string> = {
  recomendado: "sugestão (ocupação + distância)",
  proxima: "mais próximas",
  ocupacao: "menor ocupação",
  tempo: "menor tempo estimado",
  avaliacao: "melhor avaliação",
};

function BuscarScreen() {
  const upas = useStore((s) => s.upas);
  const userLoc = useStore((s) => s.userLoc);
  const filter = useStore((s) => s.filter);
  const resetFilter = useStore((s) => s.resetFilter);
  const [selected, setSelected] = useState<string[]>([]);
  const [termo, setTermo] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const servicosNecessidade = useMemo(() => {
    const set = new Set<Servico>();
    NECESSIDADES.filter((n) => selected.includes(n.id)).forEach((n) =>
      n.servicos.forEach((s) => set.add(s)),
    );
    return Array.from(set);
  }, [selected]);

  const resultados = useMemo(
    () => aplicarFiltros({ upas, userLoc, filter, termo, servicosNecessidade }),
    [upas, userLoc, filter, termo, servicosNecessidade],
  );

  const ativos = filtrosAtivos(filter, termo, servicosNecessidade);

  const limpar = () => {
    setSelected([]);
    setTermo("");
    resetFilter();
  };

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <main className="min-h-dvh bg-background pb-28">
      <header className="border-b border-border bg-card px-5 pb-5 pt-7 shadow-sm">
        <div className="mx-auto max-w-md">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Buscar UPA</h1>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            Pesquise por nome, bairro ou serviço, ou selecione o que você precisa.
          </p>

          <label className="mt-4 flex items-center gap-2.5 rounded-full border border-border bg-background px-4 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-ring/25">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              value={termo}
              onChange={(e) => setTermo(e.target.value)}
              placeholder="Nome, bairro ou serviço"
              aria-label="Buscar por nome, bairro ou serviço"
              className="w-full bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
            />
          </label>

          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={() => setShowFilters(true)}
              className="inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-2 text-xs font-semibold text-foreground transition hover:bg-muted"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 shrink-0" /> Filtrar e ordenar
              {ativos && <span className="h-2 w-2 rounded-full bg-primary" aria-hidden />}
            </button>
            {ativos && (
              <button onClick={limpar} className="text-xs font-semibold text-primary hover:underline">
                Limpar filtros
              </button>
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2.5">
            {NECESSIDADES.map((n) => {
              const on = selected.includes(n.id);
              return (
                <button
                  key={n.id}
                  onClick={() => toggle(n.id)}
                  className={
                    "flex items-center gap-2.5 rounded-2xl border px-3 py-3 text-left transition " +
                    (on
                      ? "border-primary bg-primary/10 text-primary shadow-sm"
                      : "border-border bg-card text-foreground hover:bg-muted")
                  }
                  aria-pressed={on}
                >
                  <span className="text-lg leading-none" aria-hidden>
                    {n.emoji}
                  </span>
                  <span className="text-sm font-semibold leading-tight">{n.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-md px-5 pt-5">
        <p className="mb-4 rounded-2xl border border-border bg-muted px-3.5 py-2.5 text-[11px] leading-relaxed text-muted-foreground">
          {AVISO_RECOMENDACAO}
        </p>
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {resultados.length} {resultados.length === 1 ? "UPA" : "UPAs"} · ordenadas por{" "}
            {ORDEM_LABEL[filter.ordenar]}
          </h2>
        </div>

        <ul className="space-y-3">
          {resultados.map(({ upa, dist }) => {
            const pct = percentualOcupacao(upa.ocupacao_atual, upa.capacidade_max);
            return (
              <li
                key={upa.id}
                className="rounded-3xl border border-border bg-card p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      to="/upa/$id"
                      params={{ id: upa.id }}
                      className="block truncate text-base font-bold leading-tight tracking-tight text-foreground hover:text-primary"
                    >
                      {upa.nome}
                    </Link>
                    <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">
                        {upa.bairro} · {dist.toFixed(1)} km
                      </span>
                    </div>
                    <div className="mt-2 text-sm font-bold tabular-nums text-foreground">
                      {upa.ocupacao_atual} / {upa.capacidade_max} pessoas · {pct}%
                    </div>
                    <div className="mt-0.5 text-[11px] text-muted-foreground">
                      {ORIGEM_CURTA[origemDado(upa)]}
                    </div>
                  </div>
                  <StatusBadge
                    ocupacao={upa.ocupacao_atual}
                    capacidade={upa.capacidade_max}
                    size="sm"
                  />
                </div>

                <div className="mt-3.5 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs">
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 shrink-0" /> ~{upa.tempo_estimado} min
                  </span>
                  <span className="text-border" aria-hidden>
                    |
                  </span>
                  <span className={upa.aberta ? "font-semibold text-success" : "font-semibold text-danger"}>
                    {upa.aberta ? "Aberta" : "Fechada"}
                  </span>
                  <span className="w-full truncate text-muted-foreground">
                    {upa.servicos.slice(0, 3).join(" · ")}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2.5">
                  <Link
                    to="/upa/$id"
                    params={{ id: upa.id }}
                    className="rounded-2xl bg-secondary py-2.5 text-center text-xs font-semibold text-secondary-foreground transition hover:bg-accent"
                  >
                    Detalhes
                  </Link>
                  <a
                    href={mapsUrl(upa.latitude, upa.longitude, upa.nome, userLoc)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground shadow-sm transition hover:opacity-95"
                  >
                    <Navigation className="h-3.5 w-3.5 shrink-0" /> Ir
                  </a>
                </div>
              </li>
            );
          })}
          {resultados.length === 0 && (
            <li className="rounded-3xl border border-border bg-muted p-8 text-center text-sm text-muted-foreground">
              Nenhuma UPA encontrada com esses critérios.
              <button
                onClick={limpar}
                className="mx-auto mt-4 block rounded-2xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm"
              >
                Limpar filtros
              </button>
            </li>
          )}
        </ul>
      </section>


      <FilterSheet open={showFilters} onClose={() => setShowFilters(false)} />
      <BottomNav />
    </main>
  );
}
