import { getStatus } from "@/data/upas";
import { cn } from "@/lib/utils";

export function StatusBadge({
  ocupacao,
  capacidade,
  size = "md",
  showPct = true,
}: {
  ocupacao: number;
  capacidade: number;
  size?: "sm" | "md" | "lg";
  showPct?: boolean;
}) {
  const s = getStatus(ocupacao, capacidade);
  const sizes = {
    sm: "text-[11px] px-2 py-1 gap-1.5",
    md: "text-xs px-2.5 py-1.5 gap-1.5",
    lg: "text-sm px-3.5 py-2 gap-2",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full font-semibold uppercase tracking-wide text-white shadow-sm",
        sizes[size],
      )}
      style={{ backgroundColor: s.bg }}
      aria-label={`Ocupação ${s.label}, ${s.pct}%`}
    >
      <span
        aria-hidden
        className={cn("rounded-full bg-white/85", size === "lg" ? "h-2 w-2" : "h-1.5 w-1.5")}
      />
      {showPct && <span className="font-bold tabular-nums">{s.pct}%</span>}
      <span className="font-semibold">{s.label}</span>
    </span>
  );
}
