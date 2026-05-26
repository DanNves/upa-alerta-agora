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
    sm: "text-xs px-2 py-0.5 gap-1",
    md: "text-sm px-2.5 py-1 gap-1.5",
    lg: "text-base px-3 py-1.5 gap-2",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-semibold text-white",
        sizes[size],
      )}
      style={{ backgroundColor: s.cor }}
      aria-label={`Ocupação ${s.label}, ${s.pct}%`}
    >
      <span aria-hidden>{s.emoji}</span>
      {showPct ? `${s.pct}%` : ""} <span className="opacity-90">{s.label}</span>
    </span>
  );
}
