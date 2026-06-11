import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Wrench, Megaphone, MessageSquare, Save, Trash2, Plus, Star, ShieldAlert, Lock, LogOut, Copy, User as UserIcon } from "lucide-react";
import { useStore } from "@/data/store";
import { BottomNav } from "@/components/BottomNav";
import { StatusBadge } from "@/components/StatusBadge";
import { getStatus, tempoAtras } from "@/data/upas";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  component: AdminScreen,
});

type Tab = "upas" | "campanhas" | "feedbacks";

// Credenciais demo do painel gestor (protótipo TCC)
const GESTORES: Record<string, { senha: string; nome: string }> = {
  gestor: { senha: "upa2026", nome: "Gestor Municipal" },
  sms: { senha: "salvador", nome: "Sec. Mun. de Saúde" },
};
const SESSION_KEY = "upafacil:admin:user";

function AdminScreen() {
  const [tab, setTab] = useState<Tab>("upas");
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? sessionStorage.getItem(SESSION_KEY) : null;
    if (stored) setUser(stored);
  }, []);

  if (!user) return <LoginScreen onLogin={(u) => { sessionStorage.setItem(SESSION_KEY, u); setUser(u); }} />;

  return (
    <main className="min-h-dvh bg-background pb-24">
      <header className="bg-gradient-to-br from-[#0b1530] via-[#0f1e44] to-[#11265a] px-4 pb-5 pt-6 text-white">
        <div className="mx-auto max-w-md">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="flex items-center gap-2 text-xl font-bold">
                <Wrench className="h-5 w-5 text-amber-300" /> Painel Gestor UPA Fácil
              </h1>
              <p className="mt-1 text-xs text-white/70">
                Protótipo Administrativo da Prefeitura de Salvador
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-bold tracking-wide">
                DEV MODE
              </span>
              <button
                onClick={() => { sessionStorage.removeItem(SESSION_KEY); setUser(null); }}
                className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-medium text-white/90 hover:bg-white/20"
              >
                <LogOut className="h-3 w-3" /> Sair
              </button>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-white/70">
            <UserIcon className="h-3 w-3" /> Conectado como <span className="font-semibold text-white">{GESTORES[user]?.nome ?? user}</span>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-1 rounded-2xl bg-white/10 p-1 backdrop-blur">
            <TabBtn active={tab === "upas"} onClick={() => setTab("upas")} icon={<Wrench className="h-3.5 w-3.5" />}>
              Editar UPAs
            </TabBtn>
            <TabBtn active={tab === "campanhas"} onClick={() => setTab("campanhas")} icon={<Megaphone className="h-3.5 w-3.5" />}>
              Campanhas
            </TabBtn>
            <TabBtn active={tab === "feedbacks"} onClick={() => setTab("feedbacks")} icon={<MessageSquare className="h-3.5 w-3.5" />}>
              Feedbacks
            </TabBtn>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-md px-4 pt-5">
        {tab === "upas" && <EditarUpas />}
        {tab === "campanhas" && <CriarCampanhas />}
        {tab === "feedbacks" && <Feedbacks />}
      </section>

      <BottomNav />
    </main>
  );
}

function TabBtn({
  active,
  onClick,
  children,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "flex items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-xs font-semibold transition " +
        (active ? "bg-white text-[#0b1530] shadow" : "text-white/80 hover:bg-white/10")
      }
    >
      {icon}
      {children}
    </button>
  );
}

/* ------------------------- Editar UPAs ------------------------- */

function EditarUpas() {
  const upas = useStore((s) => s.upas);
  const updateUpa = useStore((s) => s.updateUpa);

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Selecione uma UPA para ajustar lotação e fila.
      </p>
      {upas.map((u) => (
        <UpaEditorCard key={u.id} upaId={u.id} updateUpa={updateUpa} />
      ))}
      <div className="rounded-xl border border-dashed border-border bg-muted/40 p-3 text-xs text-muted-foreground">
        <ShieldAlert className="mr-1 inline h-3.5 w-3.5" />
        Alterações aqui refletem em tempo real no mapa e nas listas para todos os usuários.
      </div>
    </div>
  );
}

function UpaEditorCard({
  upaId,
  updateUpa,
}: {
  upaId: string;
  updateUpa: (id: string, p: Partial<{ ocupacao_atual: number; tempo_estimado: number; aberta: boolean }>) => void;
}) {
  const upa = useStore((s) => s.upas.find((x) => x.id === upaId)!);
  const [oc, setOc] = useState(upa.ocupacao_atual);
  const [tempo, setTempo] = useState(upa.tempo_estimado);
  const [aberta, setAberta] = useState(upa.aberta);
  const status = getStatus(oc, upa.capacidade_max);

  const dirty = oc !== upa.ocupacao_atual || tempo !== upa.tempo_estimado || aberta !== upa.aberta;

  function salvar() {
    updateUpa(upa.id, { ocupacao_atual: oc, tempo_estimado: tempo, aberta });
    toast.success(`${upa.nome} atualizada`, { description: `Lotação ${Math.round((oc / upa.capacidade_max) * 100)}% · ${tempo} min` });
  }

  return (
    <article className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-bold text-foreground">{upa.nome}</h3>
          <p className="text-xs text-muted-foreground">Bairro {upa.bairro}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={"text-xs font-semibold " + (aberta ? "text-[color:var(--success)]" : "text-muted-foreground")}>
            {aberta ? "Aberta" : "Fechada"}
          </span>
          <button
            role="switch"
            aria-checked={aberta}
            onClick={() => setAberta((v) => !v)}
            className={
              "relative h-6 w-11 rounded-full transition " +
              (aberta ? "bg-[color:var(--success)]" : "bg-muted")
            }
          >
            <span
              className={
                "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition " +
                (aberta ? "left-[22px]" : "left-0.5")
              }
            />
          </button>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <label className="block">
          <span className="text-[11px] font-medium text-muted-foreground">Pacientes na fila</span>
          <input
            type="number"
            min={0}
            max={upa.capacidade_max + 100}
            value={oc}
            onChange={(e) => setOc(Math.max(0, Number(e.target.value)))}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
          <span className="mt-1 block text-[10px] text-muted-foreground">
            Capacidade: {upa.capacidade_max}
          </span>
        </label>
        <label className="block">
          <span className="text-[11px] font-medium text-muted-foreground">Tempo estimado (min)</span>
          <input
            type="number"
            min={0}
            max={300}
            value={tempo}
            onChange={(e) => setTempo(Math.max(0, Number(e.target.value)))}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
          <span className="mt-1 block text-[10px] text-muted-foreground">
            Atualizado {tempoAtras(upa.atualizado_em)}
          </span>
        </label>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <StatusBadge ocupacao={oc} capacidade={upa.capacidade_max} />
        <span className="text-xs text-muted-foreground">{status.pct}% ocupação</span>
      </div>

      <button
        disabled={!dirty}
        onClick={salvar}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b1530] py-3 text-sm font-semibold text-white transition hover:bg-[#11265a] disabled:opacity-50"
      >
        <Save className="h-4 w-4" /> Confirmar Atualizações
      </button>
    </article>
  );
}

/* ------------------------- Criar Campanhas ------------------------- */

const ICONES = ["💉", "🦟", "🎀", "🩺", "🧒", "🫀", "🧴", "🩸"];

function CriarCampanhas() {
  const upas = useStore((s) => s.upas);
  const eventos = useStore((s) => s.eventos);
  const addEvento = useStore((s) => s.addEvento);
  const removeEvento = useStore((s) => s.removeEvento);

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [upaIdsRaw, setUpaIdsRaw] = useState("");
  const [icone, setIcone] = useState("💉");

  const idsValidos = useMemo(() => upas.map((u) => u.id).join(", "), [upas]);

  function lancar() {
    const t = titulo.trim();
    const d = descricao.trim();
    if (!t || t.length > 100) return toast.error("Título inválido (1-100 caracteres)");
    if (!d || d.length > 1000) return toast.error("Descrição inválida (1-1000 caracteres)");
    const ids = upaIdsRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const validos = ids.filter((id) => upas.some((u) => u.id === id));
    if (validos.length === 0) return toast.error("Informe ao menos uma UPA válida");

    const hoje = new Date();
    const fim = new Date();
    fim.setMonth(fim.getMonth() + 1);

    addEvento({
      titulo: t,
      descricao: d,
      data_inicio: hoje.toISOString().slice(0, 10),
      data_fim: fim.toISOString().slice(0, 10),
      upa_ids: validos,
      icone,
    });
    toast.success("Campanha lançada!", { description: `${validos.length} UPAs participando` });
    setTitulo("");
    setDescricao("");
    setUpaIdsRaw("");
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-bold">Lançar Nova Campanha de Saúde</h2>
      </div>

      <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
        <input
          value={titulo}
          maxLength={100}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder={`Título da Campanha (${titulo.length}/100)`}
          className="w-full rounded-lg border border-border bg-background px-3 py-3 text-sm focus:border-primary focus:outline-none"
        />
        <textarea
          value={descricao}
          maxLength={1000}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder={`Descrição Detalhada (${descricao.length}/1000)`}
          rows={4}
          className="w-full resize-none rounded-lg border border-border bg-background px-3 py-3 text-sm focus:border-primary focus:outline-none"
        />
        <div>
          <input
            value={upaIdsRaw}
            onChange={(e) => setUpaIdsRaw(e.target.value)}
            placeholder="IDs das UPAs (separado por vírgula)"
            className="w-full rounded-lg border border-border bg-background px-3 py-3 text-sm focus:border-primary focus:outline-none"
          />
          <p className="mt-1 text-[10px] text-muted-foreground">
            IDs válidos: {idsValidos}
          </p>
        </div>

        <div>
          <span className="text-xs font-semibold text-muted-foreground">Ícone visual:</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {ICONES.map((i) => (
              <button
                key={i}
                onClick={() => setIcone(i)}
                className={
                  "flex h-10 w-10 items-center justify-center rounded-xl border text-lg transition " +
                  (icone === i ? "border-primary bg-primary/10" : "border-border bg-background hover:bg-muted")
                }
              >
                {i}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={lancar}
          className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Lançar Campanha de Atendimento
        </button>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-muted-foreground">
          Campanhas Municipais Ativas ({eventos.length}):
        </h3>
        <ul className="mt-2 space-y-2">
          {eventos.map((ev) => (
            <li
              key={ev.id}
              className="flex items-start gap-3 rounded-2xl border border-border bg-card p-3"
            >
              <span className="text-2xl">{ev.icone}</span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">{ev.titulo}</div>
                <div className="line-clamp-2 text-xs text-muted-foreground">{ev.descricao}</div>
                <div className="mt-1 text-[10px] text-muted-foreground">
                  {ev.upa_ids.length} UPAs · até {ev.data_fim}
                </div>
              </div>
              <button
                onClick={() => {
                  removeEvento(ev.id);
                  toast.success("Campanha removida");
                }}
                aria-label="Remover"
                className="rounded-lg p-2 text-[color:var(--danger)] hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ------------------------- Feedbacks ------------------------- */

function Feedbacks() {
  const upas = useStore((s) => s.upas);
  const todos = useMemo(
    () =>
      upas
        .flatMap((u) => u.avaliacoes.map((a) => ({ ...a, upaNome: u.nome, upaId: u.id })))
        .sort((a, b) => +new Date(b.criado_em) - +new Date(a.criado_em)),
    [upas],
  );

  const media =
    todos.length === 0 ? 0 : todos.reduce((s, a) => s + a.nota, 0) / todos.length;

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              Avaliações totais
            </div>
            <div className="mt-1 text-2xl font-bold">{todos.length}</div>
          </div>
          <div className="text-right">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Média</div>
            <div className="mt-1 flex items-center gap-1 text-2xl font-bold">
              {media.toFixed(1)}
              <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
            </div>
          </div>
        </div>
      </div>

      <ul className="space-y-2">
        {todos.map((a, i) => (
          <li key={i} className="rounded-2xl border border-border bg-card p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-sm font-semibold">{a.upaNome}</span>
              <span className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star
                    key={k}
                    className={
                      "h-3.5 w-3.5 " +
                      (k < a.nota ? "fill-amber-400 text-amber-400" : "text-muted")
                    }
                  />
                ))}
              </span>
            </div>
            <p className="mt-1 text-sm text-foreground">{a.comentario}</p>
            <div className="mt-1 text-[10px] text-muted-foreground">
              Tempo real: {a.tempo_real_min} min · {tempoAtras(a.criado_em)}
            </div>
          </li>
        ))}
        {todos.length === 0 && (
          <li className="rounded-2xl border border-dashed border-border bg-muted/40 p-6 text-center text-sm text-muted-foreground">
            Nenhuma avaliação ainda.
          </li>
        )}
      </ul>
    </div>
  );
}
