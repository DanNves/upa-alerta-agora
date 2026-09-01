import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Phone, Copy, Navigation, Car, MapPin, Clock, Star, Share2, Bell } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useStore } from "@/data/store";
import { distanciaKm, getStatus, mapsUrl, origemDado, tempoAtras, uberUrl } from "@/data/upas";
import { ORIGEM_LABEL, dataHoraCompleta } from "@/data/regras";
import { pedirPermissaoNotificacao } from "@/hooks/useAlertaFavoritos";
import { StatusBadge } from "@/components/StatusBadge";
import { BottomNav } from "@/components/BottomNav";


export const Route = createFileRoute("/upa/$id")({
  component: UpaDetail,
  head: () => ({
    meta: [
      { title: "Detalhes da UPA — ocupação e serviços | UPA+" },
      {
        name: "description",
        content:
          "Ocupação atual, capacidade, serviços, endereço, CEP, telefone e rota da unidade. Dados de demonstração acadêmica.",
      },
      { property: "og:title", content: "Detalhes da UPA — UPA+" },
      {
        property: "og:description",
        content: "Ocupação, serviços, endereço e rota da unidade de pronto atendimento.",
      },
    ],
  }),

  notFoundComponent: () => (
    <div className="p-8 text-center">
      <p className="text-muted-foreground">UPA não encontrada.</p>
      <Link to="/" className="mt-3 inline-block text-primary">Voltar ao mapa</Link>
    </div>
  ),
  errorComponent: () => <div className="p-8 text-center text-muted-foreground">Ops, algo deu errado.</div>,
  loader: ({ params }) => {
    const upa = useStore.getState().upas.find((u) => u.id === params.id);
    if (!upa) throw notFound();
    return { upa };
  },
});


const servicoIcon: Record<string, string> = {
  "Clínico Geral": "🩺",
  "Pediatria": "👶",
  "Vacinação": "💉",
  "Teste Rápido": "🧪",
  "Raio-X": "🔬",
  "Exames": "🩸",
  "Ortopedia": "🦴",
  "Nebulização": "🌬️",
};

function Toast({ msg }: { msg: string }) {
  return (
    <div className="fixed inset-x-0 bottom-24 z-[1300] mx-auto w-fit animate-fade-in rounded-full bg-foreground px-4 py-2 text-sm text-background shadow-lg">
      {msg}
    </div>
  );
}

function UpaDetail() {
  const { id } = Route.useParams();
  const upa = useStore((s) => s.upas.find((u) => u.id === id))!;
  const userLoc = useStore((s) => s.userLoc);
  const [toast, setToast] = useState<string | null>(null);

  const status = getStatus(upa.ocupacao_atual, upa.capacidade_max);
  const dist = distanciaKm(userLoc, { lat: upa.latitude, lng: upa.longitude });
  const media = upa.avaliacoes.length
    ? upa.avaliacoes.reduce((a, b) => a + b.nota, 0) / upa.avaliacoes.length
    : 0;

  const copiar = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast(`${label} copiado!`);
      setTimeout(() => setToast(null), 1800);
    } catch {
      setToast("Não foi possível copiar");
      setTimeout(() => setToast(null), 1800);
    }
  };

  const maxHist = Math.max(...upa.historico.map((h) => h.ocupacao), upa.capacidade_max);

  return (
    <main className="min-h-dvh bg-background pb-24">
      {/* Hero */}
      <header
        className="relative h-48 w-full"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.48 0.21 264) 0%, oklch(0.62 0.18 250) 100%)",
        }}
      >
        <Link
          to="/"
          aria-label="Voltar"
          className="absolute left-4 top-4 rounded-full bg-white/20 p-2 text-white backdrop-blur hover:bg-white/30"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <div className="text-xs uppercase tracking-wider opacity-85">
            {upa.aberta ? "● Aberta agora" : "○ Fechada"} · Atualizado {tempoAtras(upa.atualizado_em)}
          </div>
          <h1 className="mt-1 text-2xl font-bold">{upa.nome}</h1>
        </div>
      </header>

      <div className="mx-auto max-w-md space-y-4 px-4 pt-4">
        {/* Status block */}
        <section className="rounded-3xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-foreground">
                {upa.ocupacao_atual} / {upa.capacidade_max} pessoas
              </div>
              <div className="text-lg font-semibold" style={{ color: status.cor }}>
                {status.pct}% de ocupação
              </div>
            </div>
            <StatusBadge ocupacao={upa.ocupacao_atual} capacidade={upa.capacidade_max} size="lg" />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Atualizado {tempoAtras(upa.atualizado_em)} · Última atualização:{" "}
            {dataHoraCompleta(upa.atualizado_em)}
            <br />
            Origem: {ORIGEM_LABEL[origemDado(upa)]}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl bg-muted px-3 py-3">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="h-4 w-4" /> Tempo estimado
              </div>
              <div className="mt-1 text-lg font-bold">~{upa.tempo_estimado} min</div>
            </div>
            <div className="rounded-2xl bg-muted px-3 py-3">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="h-4 w-4" /> Distância
              </div>
              <div className="mt-1 text-lg font-bold">{dist.toFixed(1)} km</div>
            </div>
          </div>
        </section>

        {/* Info */}
        <section className="space-y-2 rounded-3xl border border-border bg-card p-5 text-sm">
          <Row icon="📍" label={upa.endereco + " — " + upa.bairro} />
          <Row
            icon="🗺"
            label={"CEP: " + upa.cep}
            action={
              <button
                onClick={() => copiar(upa.cep, "CEP")}
                className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground hover:bg-accent"
              >
                <Copy className="h-3 w-3" /> Copiar
              </button>
            }
          />
          <Row
            icon="📞"
            label={upa.telefone}
            action={
              <a
                href={`tel:${upa.telefone.replace(/\D/g, "")}`}
                className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground hover:opacity-95"
              >
                <Phone className="h-3 w-3" /> Ligar
              </a>
            }
          />
          <Row icon="🏷" label={"Referência: " + upa.referencia} />
          <Row icon="🕐" label="Funcionamento: 24 horas" />
        </section>

        {/* Servicos */}
        <section className="rounded-3xl border border-border bg-card p-5">
          <h2 className="text-sm font-bold text-foreground">Serviços disponíveis</h2>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {upa.servicos.map((s) => (
              <div
                key={s}
                className="flex flex-col items-center gap-1 rounded-2xl bg-muted px-2 py-3 text-center"
              >
                <span className="text-xl" aria-hidden>{servicoIcon[s] ?? "🏥"}</span>
                <span className="text-[11px] font-medium leading-tight">{s}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Actions */}
        <section className="grid grid-cols-1 gap-2">
          <a
            href={mapsUrl(upa.latitude, upa.longitude, upa.nome, userLoc)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 font-semibold text-primary-foreground shadow-sm hover:opacity-95"
          >
            <Navigation className="h-4 w-4" /> Abrir no Google Maps
          </a>
          <a
            href={uberUrl(upa.latitude, upa.longitude)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-foreground py-3.5 font-semibold text-background hover:opacity-90"
          >
            <Car className="h-4 w-4" /> Chamar Uber
          </a>
          <button
            onClick={() => copiar(`${upa.endereco}, ${upa.bairro}, ${upa.cidade}/${upa.estado} - CEP ${upa.cep}`, "Endereço")}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-secondary py-3 font-semibold text-secondary-foreground hover:bg-accent"
          >
            <Copy className="h-4 w-4" /> Copiar endereço completo
          </button>
          <button
            onClick={async () => {
              const url = mapsUrl(upa.latitude, upa.longitude);
              const texto = `${upa.nome} — ${upa.endereco}, ${upa.bairro}, ${upa.cidade}/${upa.estado} (CEP ${upa.cep})`;
              if (typeof navigator !== "undefined" && "share" in navigator) {
                try {
                  await navigator.share({ title: upa.nome, text: texto, url });
                  return;
                } catch {
                  /* usuário cancelou — segue para cópia */
                }
              }
              copiar(`${texto}\n${url}`, "Localização");
            }}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-secondary py-3 font-semibold text-secondary-foreground hover:bg-accent"
          >
            <Share2 className="h-4 w-4" /> Compartilhar localização
          </button>
        </section>


        {/* Histórico */}
        <section className="rounded-3xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold">Ocupação · últimas 12h</h2>
            <span className="text-xs text-muted-foreground">cap. {upa.capacidade_max}</span>
          </div>
          <div className="mt-4 flex h-32 items-end gap-1.5">
            {upa.historico.map((h, i) => {
              const pct = (h.ocupacao / maxHist) * 100;
              const s = getStatus(h.ocupacao, upa.capacidade_max);
              return (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-md transition-all"
                    style={{ height: `${pct}%`, backgroundColor: s.cor, minHeight: 4 }}
                    title={`${h.hora}: ${h.ocupacao} pessoas`}
                  />
                  <span className="text-[9px] text-muted-foreground">{h.hora}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Avaliações */}
        <section className="rounded-3xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold">Avaliações</h2>
            <Link
              to="/avaliar"
              search={{ upaId: upa.id }}
              className="text-xs font-semibold text-primary hover:underline"
            >
              Avaliar esta UPA
            </Link>
          </div>
          {upa.avaliacoes.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">Ainda sem avaliações. Seja o primeiro!</p>
          ) : (
            <>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4"
                      fill={i < Math.round(media) ? "#F59E0B" : "transparent"}
                      stroke="#F59E0B"
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold">{media.toFixed(1)}</span>
                <span className="text-xs text-muted-foreground">
                  · {upa.avaliacoes.length} avaliações
                </span>
              </div>
              <ul className="mt-3 space-y-3">
                {upa.avaliacoes.slice(0, 3).map((a, i) => (
                  <li key={i} className="rounded-2xl bg-muted p-3">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: a.nota }).map((_, j) => (
                        <Star key={j} className="h-3.5 w-3.5" fill="#F59E0B" stroke="#F59E0B" />
                      ))}
                      <span className="ml-2 text-xs text-muted-foreground">
                        Esperou {a.tempo_real_min} min
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-foreground">{a.comentario}</p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      </div>

      {toast && <Toast msg={toast} />}
      <BottomNav />
    </main>
  );
}

function Row({ icon, label, action }: { icon: string; label: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <div className="flex min-w-0 items-start gap-2">
        <span aria-hidden>{icon}</span>
        <span className="text-sm text-foreground">{label}</span>
      </div>
      {action}
    </div>
  );
}
