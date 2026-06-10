import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import { Search, Crosshair, SlidersHorizontal, Siren, MapPin, Clock } from "lucide-react";
import { useStore } from "@/data/store";
import { distanciaKm, melhorOpcao, getStatus } from "@/data/upas";
import { UpaBottomSheet } from "@/components/UpaBottomSheet";
import { FilterSheet } from "@/components/FilterSheet";
import { EmergencyModal } from "@/components/EmergencyModal";
import { BottomNav } from "@/components/BottomNav";
import { StatusBadge } from "@/components/StatusBadge";

const UPAMap = lazy(() => import("@/components/UPAMap").then((m) => ({ default: m.UPAMap })));

export const Route = createFileRoute("/")({
  component: MapScreen,
});

function MapScreen() {
  const upas = useStore((s) => s.upas);
  const userLoc = useStore((s) => s.userLoc);
  const setUserLoc = useStore((s) => s.setUserLoc);
  const selectedId = useStore((s) => s.selectedId);
  const setSelected = useStore((s) => s.setSelected);

  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);

  const melhor = melhorOpcao(upas, userLoc);
  const distMelhor = melhor ? distanciaKm(userLoc, { lat: melhor.upa.latitude, lng: melhor.upa.longitude }) : 0;

  const filtered = upas.filter((u) =>
    query.trim()
      ? u.nome.toLowerCase().includes(query.toLowerCase()) ||
        u.bairro.toLowerCase().includes(query.toLowerCase())
      : true,
  );

  const selected = selectedId ? upas.find((u) => u.id === selectedId) : null;

  const localizar = () => {
    if (!("geolocation" in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (p) => setUserLoc({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => {},
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-background">
      {/* Map */}
      <div className="absolute inset-0">
        <Suspense fallback={<div className="h-full w-full animate-pulse bg-muted" />}>
          <UPAMap onSelect={setSelected} focusId={selectedId} />
        </Suspense>
      </div>

      {/* Top: search + best option banner */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[800] flex flex-col gap-2 p-3 sm:p-4">
        <div className="pointer-events-auto mx-auto w-full max-w-md">
          <label className="flex items-center gap-2 rounded-full border border-border bg-card/95 px-4 py-2.5 shadow-[var(--shadow-card)] backdrop-blur">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar UPA por nome ou bairro"
              className="w-full bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
              aria-label="Buscar UPA"
            />
          </label>
        </div>

        {melhor && (
          <button
            onClick={() => setSelected(melhor.upa.id)}
            className="pointer-events-auto mx-auto flex w-full max-w-md items-center gap-3 rounded-2xl bg-primary px-4 py-3 text-left text-primary-foreground shadow-[var(--shadow-card)] transition hover:opacity-95"
          >
            <span className="text-xl">📍</span>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] uppercase tracking-wider opacity-80">Melhor opção agora</div>
              <div className="truncate text-sm font-bold">{melhor.upa.nome}</div>
            </div>
            <div className="flex shrink-0 items-center gap-2 text-xs font-semibold">
              <span
                className="rounded-full px-2 py-0.5"
                style={{ backgroundColor: getStatus(melhor.upa.ocupacao_atual, melhor.upa.capacidade_max).cor }}
              >
                {Math.round(melhor.pct)}%
              </span>
              <span className="opacity-90">{melhor.upa.tempo_estimado} min</span>
              <span className="opacity-90">{distMelhor.toFixed(1)} km</span>
            </div>
          </button>
        )}

        {/* Search results dropdown */}
        {query.trim() && (
          <div className="pointer-events-auto mx-auto w-full max-w-md rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
            {filtered.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground">Nenhuma UPA encontrada.</div>
            ) : (
              <ul className="max-h-72 divide-y divide-border overflow-auto">
                {filtered.map((u) => (
                  <li key={u.id}>
                    <button
                      onClick={() => {
                        setSelected(u.id);
                        setQuery("");
                      }}
                      className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-muted"
                    >
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold">{u.nome}</div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" /> {u.bairro}
                          <Clock className="ml-2 h-3 w-3" /> ~{u.tempo_estimado} min
                        </div>
                      </div>
                      <StatusBadge ocupacao={u.ocupacao_atual} capacidade={u.capacidade_max} size="sm" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Right side controls */}
      <div className="absolute right-3 top-32 z-[800] flex flex-col gap-2 sm:right-4">
        <button
          onClick={localizar}
          aria-label="Localizar-me"
          className="rounded-full bg-card p-3 text-foreground shadow-[var(--shadow-card)] border border-border hover:bg-muted"
        >
          <Crosshair className="h-5 w-5" />
        </button>
      </div>

      {/* Bottom action bar (only when no sheet) */}
      {!selected && (
        <div className="pointer-events-none absolute inset-x-0 bottom-16 z-[800] flex justify-center px-3 pb-2">
          <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-border bg-card/95 p-1.5 shadow-[var(--shadow-card)] backdrop-blur">
            <button
              onClick={() => setShowFilters(true)}
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted"
            >
              <SlidersHorizontal className="h-4 w-4" /> Filtrar
            </button>
            <div className="h-5 w-px bg-border" />
            <button
              onClick={() => setShowEmergency(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-emergency px-3.5 py-2 text-xs font-bold text-emergency-foreground hover:opacity-95"
            >
              <Siren className="h-4 w-4" /> Emergência
            </button>
          </div>
        </div>
      )}

      {selected && <UpaBottomSheet upa={selected} onClose={() => setSelected(null)} />}
      <FilterSheet open={showFilters} onClose={() => setShowFilters(false)} />
      <EmergencyModal open={showEmergency} onClose={() => setShowEmergency(false)} />

      <BottomNav />
    </main>
  );
}
