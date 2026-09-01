import { getStatus, tempoAtras, type UPA } from "@/data/upas";
import { StatusBadge } from "./StatusBadge";

/**
 * Apresenta a ocupação de forma quantitativa (RF03–RF06):
 * "80 / 150 pessoas · 53% de ocupação", com indicador visual complementar.
 */
export function OcupacaoInfo({
  upa,
  size = "md",
  showAtualizacao = true,
}: {
  upa: UPA;
  size?: "sm" | "md" | "lg";
  showAtualizacao?: boolean;
}) {
  const s = getStatus(upa.ocupacao_atual, upa.capacidade_max);
  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
        <span
          className={
            (size === "lg" ? "text-xl" : size === "sm" ? "text-xs" : "text-sm") +
            " font-bold tabular-nums tracking-tight text-foreground"
          }
        >
          {upa.ocupacao_atual} / {upa.capacidade_max} pessoas
        </span>
        <span
          className={(size === "sm" ? "text-xs" : "text-sm") + " font-semibold tabular-nums"}
          style={{ color: s.corTexto }}
        >
          {s.pct}% de ocupação
        </span>
        <StatusBadge ocupacao={upa.ocupacao_atual} capacidade={upa.capacidade_max} size="sm" />
      </div>
      {showAtualizacao && (
        <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
          Atualizado {tempoAtras(upa.atualizado_em)}
        </p>
      )}
    </div>
  );
}
