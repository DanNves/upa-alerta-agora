import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MapPin, Clock, Navigation } from "lucide-react";
import { useStore } from "@/data/store";
import { distanciaKm, mapsUrl, type Servico } from "@/data/upas";
import { StatusBadge } from "@/components/StatusBadge";
import { BottomNav } from "@/components/BottomNav";

export const Route = createFileRoute("/buscar")({
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

function BuscarScreen() {
  const upas = useStore((s) => s.upas);
  const userLoc = useStore((s) => s.userLoc);
  const [selected, setSelected] = useState<string[]>([]);

  const required = useMemo(() => {
    const set = new Set<Servico>();
    NECESSIDADES.filter((n) => selected.includes(n.id)).forEach((n) => n.servicos.forEach((s) => set.add(s)));
    return Array.from(set);
  }, [selected]);

  const resultados = useMemo(() => {
    const list = upas
      .filter((u) => u.aberta)
      .filter((u) => (required.length ? required.some((s) => u.servicos.includes(s)) : true))
      .map((u) => {
        const dist = distanciaKm(userLoc, { lat: u.latitude, lng: u.longitude });
        const pct = (u.ocupacao_atual / u.capacidade_max) * 100;
        return { upa: u, dist, score: pct * 0.6 + dist * 10 * 0.4 };
      })
      .sort((a, b) => a.score - b.score);
    return list;
  }, [upas, userLoc, required]);

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <main className="min-h-dvh bg-background pb-24">
      <header className="bg-card px-4 pb-4 pt-6 shadow-sm">
        <div className="mx-auto max-w-md">
          <h1 className="text-2xl font-bold">Do que você precisa?</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Selecione um ou mais cards para encontrar as UPAs ideais.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {NECESSIDADES.map((n) => {
              const on = selected.includes(n.id);
              return (
                <button
                  key={n.id}
                  onClick={() => toggle(n.id)}
                  className={
                    "flex items-center gap-2 rounded-2xl border px-3 py-3 text-left transition " +
                    (on
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card hover:bg-muted")
                  }
                  aria-pressed={on}
                >
                  <span className="text-xl">{n.emoji}</span>
                  <span className="text-sm font-semibold">{n.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-md px-4 pt-4">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-muted-foreground">
            {selected.length ? `${resultados.length} UPAs recomendadas` : "Todas as UPAs · por melhor opção"}
          </h2>
          {selected.length > 0 && (
            <button onClick={() => setSelected([])} className="text-xs font-semibold text-primary">
              Limpar
            </button>
          )}
        </div>

        <ul className="space-y-2">
          {resultados.map(({ upa, dist }) => (
            <li key={upa.id} className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <Link
                    to="/upa/$id"
                    params={{ id: upa.id }}
                    className="block truncate text-base font-bold hover:text-primary"
                  >
                    {upa.nome}
                  </Link>
                  <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {upa.bairro} · {dist.toFixed(1)} km
                  </div>
                </div>
                <StatusBadge ocupacao={upa.ocupacao_atual} capacidade={upa.capacidade_max} size="sm" />
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3 w-3" /> ~{upa.tempo_estimado} min
                </span>
                <span className="text-muted-foreground">
                  · {upa.servicos.slice(0, 3).join(" · ")}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <Link
                  to="/upa/$id"
                  params={{ id: upa.id }}
                  className="rounded-xl bg-secondary py-2 text-center text-xs font-semibold text-secondary-foreground hover:bg-accent"
                >
                  Detalhes
                </Link>
                <a
                  href={mapsUrl(upa.latitude, upa.longitude, upa.nome)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1 rounded-xl bg-primary py-2 text-xs font-semibold text-primary-foreground hover:opacity-95"
                >
                  <Navigation className="h-3.5 w-3.5" /> Ir
                </a>
              </div>
            </li>
          ))}
          {resultados.length === 0 && (
            <li className="rounded-2xl bg-muted p-6 text-center text-sm text-muted-foreground">
              Nenhuma UPA encontrada para os serviços selecionados.
            </li>
          )}
        </ul>
      </section>

      <BottomNav />
    </main>
  );
}
