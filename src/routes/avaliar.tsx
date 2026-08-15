import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Star, Check } from "lucide-react";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-adapter";
import { useStore } from "@/data/store";
import { BottomNav } from "@/components/BottomNav";

const searchSchema = z.object({
  upaId: z.string().optional(),
});

export const Route = createFileRoute("/avaliar")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Avaliar atendimento na UPA | UPA+" },
      {
        name: "description",
        content:
          "Registre sua nota, o tempo real de espera e um comentário sobre o atendimento recebido na UPA.",
      },
      { property: "og:title", content: "Avaliar atendimento | UPA+" },
      {
        property: "og:description",
        content: "Compartilhe nota, tempo de espera e comentário sobre o atendimento na UPA.",
      },
    ],
  }),
  component: AvaliarScreen,
});


function AvaliarScreen() {
  const upas = useStore((s) => s.upas);
  const addAvaliacao = useStore((s) => s.addAvaliacao);
  const { upaId } = Route.useSearch();
  const navigate = useNavigate();

  const [selected, setSelected] = useState<string>(upaId ?? upas[0]?.id ?? "");
  const [nota, setNota] = useState(0);
  const [tempo, setTempo] = useState<number | "">("");
  const [comentario, setComentario] = useState("");
  const [enviado, setEnviado] = useState(false);

  const enviar = () => {
    if (!selected || !nota || typeof tempo !== "number") return;
    addAvaliacao(selected, nota, tempo, comentario.trim() || "Sem comentário.");
    setEnviado(true);
    setTimeout(() => navigate({ to: "/upa/$id", params: { id: selected } }), 1200);
  };

  if (enviado) {
    return (
      <main className="grid min-h-dvh place-items-center bg-background px-6">
        <div className="text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success text-success-foreground">
            <Check className="h-8 w-8" />
          </div>
          <h1 className="mt-4 text-xl font-bold">Avaliação enviada!</h1>
          <p className="mt-1 text-sm text-muted-foreground">Obrigado por ajudar outros cidadãos.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-background pb-28">
      <header className="bg-card px-4 pb-4 pt-6 shadow-sm">
        <div className="mx-auto max-w-md">
          <h1 className="text-2xl font-bold">⭐ Avaliar uma UPA</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sua avaliação ajuda a melhorar a estimativa para todos.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-md space-y-5 px-4 pt-5">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            UPA visitada
          </label>
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {upas.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nome} — {u.bairro}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Sua nota
          </label>
          <div className="mt-2 flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-4">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setNota(n)}
                aria-label={`${n} estrelas`}
                className="p-1"
              >
                <Star
                  className="h-8 w-8 transition"
                  fill={n <= nota ? "#F59E0B" : "transparent"}
                  stroke={n <= nota ? "#F59E0B" : "#94a3b8"}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Tempo real de espera (minutos)
          </label>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={tempo}
            onChange={(e) => setTempo(e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="Ex: 35"
            className="mt-2 w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Comentário (opcional)
          </label>
          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            rows={4}
            maxLength={400}
            placeholder="Como foi sua experiência?"
            className="mt-2 w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <div className="mt-1 text-right text-[11px] text-muted-foreground">{comentario.length}/400</div>
        </div>

        <button
          onClick={enviar}
          disabled={!selected || !nota || typeof tempo !== "number"}
          className="w-full rounded-2xl bg-primary py-3.5 font-semibold text-primary-foreground shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Enviar avaliação
        </button>
      </section>

      <BottomNav />
    </main>
  );
}
