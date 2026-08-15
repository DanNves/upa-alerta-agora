import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { MapPin, Clock, Navigation, X, RefreshCw } from "lucide-react";
import { OcupacaoInfo } from "./OcupacaoInfo";
import { distanciaKm, mapsUrl, origemDado, tempoAtras, type UPA } from "@/data/upas";
import { ORIGEM_LABEL } from "@/data/regras";
import { useStore } from "@/data/store";


export function UpaBottomSheet({ upa, onClose }: { upa: UPA; onClose: () => void }) {
  const userLoc = useStore((s) => s.userLoc);
  const dist = distanciaKm(userLoc, { lat: upa.latitude, lng: upa.longitude });
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1000] flex justify-center px-3 pb-3 sm:pb-6">
      <div className="pointer-events-auto w-full max-w-md animate-slide-up rounded-3xl bg-card p-5 shadow-[var(--shadow-card)] border border-border">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-lg">🏥</span>
              <h2 className="truncate text-lg font-bold text-foreground">{upa.nome}</h2>
            </div>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{upa.endereco} — {upa.bairro}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="rounded-full p-1.5 text-muted-foreground hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 rounded-2xl bg-muted px-3 py-3">
          <OcupacaoInfo upa={upa} showAtualizacao={false} />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <span className="inline-flex items-center gap-1 text-foreground">
            <Clock className="h-4 w-4 text-muted-foreground" /> ~{upa.tempo_estimado} min estimados
          </span>
          <span className="text-muted-foreground">📍 {dist.toFixed(1)} km</span>
          <span className={upa.aberta ? "text-success font-medium" : "text-danger font-medium"}>
            {upa.aberta ? "Aberta agora" : "Fechada"}
          </span>
        </div>

        <div className="mt-3 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Serviços: </span>
          {upa.servicos.slice(0, 4).join(" · ")}
          {upa.servicos.length > 4 ? ` · +${upa.servicos.length - 4}` : ""}
        </div>

        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
          <RefreshCw className="h-3 w-3" />
          <span>Atualizado {tempoAtras(upa.atualizado_em)} · {ORIGEM_LABEL[origemDado(upa)]}</span>
        </div>


        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link
            to="/upa/$id"
            params={{ id: upa.id }}
            className="rounded-2xl bg-secondary px-4 py-3 text-center text-sm font-semibold text-secondary-foreground hover:bg-accent transition"
          >
            Ver detalhes
          </Link>
          <a
            href={mapsUrl(upa.latitude, upa.longitude, upa.nome, userLoc)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-95 transition"
          >
            <Navigation className="h-4 w-4" /> Ir agora
          </a>
        </div>
      </div>
    </div>
  );
}
