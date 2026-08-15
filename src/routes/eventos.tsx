import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Calendar, ChevronRight, X, Shield } from "lucide-react";
import { useStore } from "@/data/store";
import { statusEvento, type Evento } from "@/data/upas";
import { StatusBadge } from "@/components/StatusBadge";
import { BottomNav } from "@/components/BottomNav";

export const Route = createFileRoute("/eventos")({
  head: () => ({
    meta: [
      { title: "Eventos e campanhas de saúde nas UPAs | UPA+" },
      {
        name: "description",
        content:
          "Campanhas de vacinação, testagem e mutirões nas UPAs de Salvador, com datas e unidades participantes.",
      },
      { property: "og:title", content: "Eventos e campanhas | UPA+" },
      {
        property: "og:description",
        content: "Campanhas e mutirões de saúde nas UPAs de Salvador com datas e unidades.",
      },
    ],
  }),
  component: EventosScreen,
});

function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}


function EventosScreen() {
  const [open, setOpen] = useState<Evento | null>(null);
  const upas = useStore((s) => s.upas);

  const eventos = useStore((s) => s.eventos);

  return (
    <main className="min-h-dvh bg-background pb-24">
      <header className="bg-card px-4 pb-4 pt-6 shadow-sm">
        <div className="mx-auto max-w-md">
          <h1 className="text-2xl font-bold">📣 Eventos e campanhas</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Acompanhe campanhas de saúde da prefeitura.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-md space-y-3 px-4 pt-4">
        {eventos.map((ev) => {
          const ups = ev.upa_ids.length;
          return (
            <button
              key={ev.id}
              onClick={() => setOpen(ev)}
              className="block w-full rounded-2xl border border-border bg-card p-4 text-left transition hover:shadow-[var(--shadow-card)]"
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{ev.icone}</span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-bold text-foreground">{ev.titulo}</h2>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{ev.descricao}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Até {formatDate(ev.data_fim)}
                    </span>
                    <span>🏥 {ups} UPAs participando</span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </button>
          );
        })}
      </section>

      {open && (
        <div className="fixed inset-0 z-[1100] flex items-end justify-center animate-fade-in">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setOpen(null)} />
          <div className="relative max-h-[85vh] w-full max-w-md animate-slide-up overflow-auto rounded-t-3xl bg-card p-5 sm:mb-6 sm:rounded-3xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-3xl">{open.icone}</div>
                <h2 className="mt-2 text-xl font-bold">{open.titulo}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatDate(open.data_inicio)} — {formatDate(open.data_fim)}
                </p>
              </div>
              <button onClick={() => setOpen(null)} aria-label="Fechar" className="rounded-full p-1.5 hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mt-3 text-sm text-foreground">{open.descricao}</p>

            <h3 className="mt-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              UPAs participantes
            </h3>
            <ul className="mt-2 space-y-2">
              {open.upa_ids.map((id) => {
                const u = upas.find((x) => x.id === id);
                if (!u) return null;
                return (
                  <li key={id}>
                    <Link
                      to="/upa/$id"
                      params={{ id }}
                      className="flex items-center justify-between gap-2 rounded-2xl border border-border bg-card p-3 hover:bg-muted"
                    >
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold">{u.nome}</div>
                        <div className="text-xs text-muted-foreground">{u.bairro}</div>
                      </div>
                      <StatusBadge ocupacao={u.ocupacao_atual} capacidade={u.capacidade_max} size="sm" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      <BottomNav />
    </main>
  );
}
