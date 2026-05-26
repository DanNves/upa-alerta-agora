import { X } from "lucide-react";
import { useStore } from "@/data/store";
import { SERVICOS_TODOS } from "@/data/upas";

export function FilterSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const filter = useStore((s) => s.filter);
  const setFilter = useStore((s) => s.setFilter);
  const reset = useStore((s) => s.resetFilter);

  if (!open) return null;

  const toggleServico = (s: string) => {
    const has = filter.servicos.includes(s);
    setFilter({ servicos: has ? filter.servicos.filter((x) => x !== s) : [...filter.servicos, s] });
  };

  const ordenarOpts = [
    { v: "ocupacao", label: "Menor ocupação primeiro" },
    { v: "proxima", label: "Mais próxima de mim" },
    { v: "tempo", label: "Menor tempo de espera" },
    { v: "avaliacao", label: "Melhor avaliação" },
  ] as const;

  return (
    <div className="fixed inset-0 z-[1100] flex items-end justify-center animate-fade-in">
      <div className="absolute inset-0 bg-foreground/40" onClick={onClose} />
      <div className="relative w-full max-w-md animate-slide-up rounded-t-3xl bg-card p-5 shadow-[var(--shadow-card)] sm:mb-6 sm:rounded-3xl">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold">🎯 Filtrar e Ordenar</h3>
          <button onClick={onClose} aria-label="Fechar" className="rounded-full p-1.5 hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        </div>

        <section className="mt-4">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Ordenar por</h4>
          <div className="mt-2 space-y-1.5">
            {ordenarOpts.map((o) => (
              <label key={o.v} className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2 hover:bg-muted">
                <input
                  type="radio"
                  name="ordenar"
                  checked={filter.ordenar === o.v}
                  onChange={() => setFilter({ ordenar: o.v })}
                  className="h-4 w-4 accent-primary"
                />
                <span className="text-sm">{o.label}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="mt-5">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Serviços disponíveis</h4>
          <div className="mt-2 flex flex-wrap gap-2">
            {SERVICOS_TODOS.map((s) => {
              const on = filter.servicos.includes(s);
              return (
                <button
                  key={s}
                  onClick={() => toggleServico(s)}
                  className={
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition " +
                    (on
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground hover:bg-muted")
                  }
                >
                  {s}
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-5">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</h4>
          <div className="mt-2 flex flex-wrap gap-2">
            <Toggle
              label="Só baixa ocupação"
              on={filter.apenasBaixaOcupacao}
              onClick={() => setFilter({ apenasBaixaOcupacao: !filter.apenasBaixaOcupacao })}
            />
            <Toggle
              label="Abertas agora"
              on={filter.apenasAbertas}
              onClick={() => setFilter({ apenasAbertas: !filter.apenasAbertas })}
            />
          </div>
        </section>

        <div className="mt-6 grid grid-cols-2 gap-2">
          <button onClick={reset} className="rounded-2xl bg-secondary py-3 text-sm font-semibold text-secondary-foreground hover:bg-accent">
            Limpar
          </button>
          <button onClick={onClose} className="rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-95">
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
}

function Toggle({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={
        "rounded-full border px-3 py-1.5 text-xs font-medium transition " +
        (on
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-foreground hover:bg-muted")
      }
    >
      {label}
    </button>
  );
}
