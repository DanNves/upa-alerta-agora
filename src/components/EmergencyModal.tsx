import { Phone, X, Navigation } from "lucide-react";
import { useStore } from "@/data/store";
import { distanciaKm, mapsUrl, melhorOpcao } from "@/data/upas";
import { StatusBadge } from "./StatusBadge";

export function EmergencyModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const upas = useStore((s) => s.upas);
  const userLoc = useStore((s) => s.userLoc);

  if (!open) return null;
  const melhor = melhorOpcao(upas, userLoc);
  const dist = melhor ? distanciaKm(userLoc, { lat: melhor.upa.latitude, lng: melhor.upa.longitude }) : 0;

  const calls = [
    { num: "192", label: "SAMU", icon: "🚑" },
    { num: "193", label: "Bombeiros", icon: "🚒" },
    { num: "190", label: "Polícia", icon: "🚓" },
  ];

  return (
    <div
      className="fixed inset-0 z-[1200] flex flex-col p-6 text-white animate-fade-in"
      style={{
        background:
          "radial-gradient(120% 80% at 50% 0%, #7C3AED 0%, #4C1D95 55%, #1E1B4B 100%)",
      }}
      role="dialog"
      aria-modal="true"
    >
      <button
        onClick={onClose}
        aria-label="Sair do modo emergência"
        className="absolute right-5 top-5 rounded-full bg-white/15 p-2 backdrop-blur hover:bg-white/25"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="mx-auto mt-6 flex max-w-md flex-1 flex-col">
        <div className="text-center">
          <div className="text-5xl">🚨</div>
          <h1 className="mt-3 text-3xl font-bold">EMERGÊNCIA</h1>
          <p className="mt-1 text-sm text-white/80">Toque para chamar imediatamente</p>
        </div>

        <div className="mt-6 space-y-3">
          {calls.map((c) => (
            <a
              key={c.num}
              href={`tel:${c.num}`}
              className="flex items-center justify-between rounded-2xl bg-white/15 px-5 py-4 backdrop-blur transition hover:bg-white/25"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{c.icon}</span>
                <div>
                  <div className="font-semibold">Ligar para {c.label}</div>
                  <div className="text-sm text-white/75">{c.num}</div>
                </div>
              </div>
              <Phone className="h-5 w-5" />
            </a>
          ))}
        </div>

        {melhor && (
          <div className="mt-8 rounded-3xl bg-white/10 p-5 backdrop-blur">
            <div className="text-xs uppercase tracking-wider text-white/70">UPA mais próxima agora</div>
            <div className="mt-2 text-lg font-bold">🏥 {melhor.upa.nome}</div>
            <div className="mt-1 text-sm text-white/85">
              {dist.toFixed(1)} km · ~{melhor.upa.tempo_estimado} min
            </div>
            <div className="mt-2">
              <StatusBadge ocupacao={melhor.upa.ocupacao_atual} capacidade={melhor.upa.capacidade_max} />
            </div>
            <a
              href={mapsUrl(melhor.upa.latitude, melhor.upa.longitude, melhor.upa.nome)}
              target="_blank"
              rel="noreferrer"
              className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-white py-3 font-semibold text-emergency hover:bg-white/90"
            >
              <Navigation className="h-5 w-5" /> Rota imediata
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
