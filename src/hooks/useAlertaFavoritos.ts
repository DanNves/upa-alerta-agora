import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useStore } from "@/data/store";
import { getStatus, type UPA } from "@/data/upas";
import { nivelOcupacao, percentualOcupacao, type NivelOcupacao } from "@/data/regras";

const CHAVE_PERMISSAO = "upa-plus:notificacoes";

/** Pede permissão de notificação ao navegador (uma vez por favoritação). */
export async function pedirPermissaoNotificacao(): Promise<NotificationPermission> {
  if (typeof window === "undefined" || !("Notification" in window)) return "denied";
  if (Notification.permission !== "default") return Notification.permission;
  try {
    const p = await Notification.requestPermission();
    localStorage.setItem(CHAVE_PERMISSAO, p);
    return p;
  } catch {
    return "denied";
  }
}

function notificar(upa: UPA) {
  const pct = percentualOcupacao(upa.ocupacao_atual, upa.capacidade_max);
  const titulo = `🟢 ${upa.nome} está com ocupação baixa`;
  const corpo = `${upa.ocupacao_atual}/${upa.capacidade_max} pessoas (${pct}%) · ~${upa.tempo_estimado} min · ${upa.bairro}`;

  toast.success(titulo, { description: corpo, duration: 8000 });

  if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
    try {
      new Notification(titulo, { body: corpo, tag: `upa-baixa-${upa.id}`, icon: "/favicon.ico" });
    } catch {
      /* navegadores móveis podem exigir service worker — o toast já avisou */
    }
  }
}

/**
 * Monitora as UPAs favoritas em memória e dispara uma notificação local
 * quando o nível de ocupação passa a ser "baixa" (RN04).
 * Sem servidor: a checagem acontece a cada atualização de dados do app.
 */
export function useAlertaFavoritos() {
  const upas = useStore((s) => s.upas);
  const favoritos = useStore((s) => s.favoritos);
  const anterior = useRef<Record<string, NivelOcupacao>>({});

  useEffect(() => {
    upas.forEach((u) => {
      const nivel = nivelOcupacao(getStatus(u.ocupacao_atual, u.capacidade_max).pct);
      const antes = anterior.current[u.id];
      anterior.current[u.id] = nivel;
      if (!favoritos.includes(u.id)) return;
      if (antes && antes !== "baixa" && nivel === "baixa") notificar(u);
    });
  }, [upas, favoritos]);
}
