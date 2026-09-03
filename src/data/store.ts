import { create } from "zustand";
import { UPAS_SEED, EVENTOS_SEED, type UPA, type Evento, DEFAULT_USER_LOC } from "./upas";
import { FILTRO_PADRAO, type FilterState } from "./filtros";
import type { OrigemDado } from "./regras";
import {
  atualizarUpaOperacional,
  buscarEventos,
  buscarUpas,
  inserirAvaliacao,
  inserirHistoricoOcupacao,
} from "@/integrations/supabase/dados";


const CHAVE_FAVORITOS = "upa-plus:favoritos";

function lerFavoritos(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CHAVE_FAVORITOS);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function salvarFavoritos(ids: string[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(ids));
  } catch {
    /* modo privado / storage indisponível */
  }
}

type Store = {
  upas: UPA[];
  eventos: Evento[];
  userLoc: { lat: number; lng: number };
  setUserLoc: (l: { lat: number; lng: number }) => void;
  selectedId: string | null;
  setSelected: (id: string | null) => void;
  /** UPAs favoritas (monitoradas para alerta de ocupação baixa). */
  favoritos: string[];
  toggleFavorito: (upaId: string) => boolean;
  carregarFavoritos: () => void;
  filter: FilterState;
  setFilter: (f: Partial<FilterState>) => void;

  resetFilter: () => void;
  addAvaliacao: (upaId: string, nota: number, tempo: number, comentario: string) => void;
  /**
   * Atualiza uma unidade registrando a origem do dado (RN15/RN17).
   * `origem` padrão é "manual" (painel do gestor); a simulação usa "simulada".
   */
  updateUpa: (upaId: string, patch: Partial<UPA>, origem?: OrigemDado) => void;
  /** Devolve a unidade ao modo de simulação automática (demonstração). */
  voltarParaSimulacao: (upaId: string) => void;
  addEvento: (e: Omit<Evento, "id">) => void;
  updateEvento: (id: string, patch: Partial<Omit<Evento, "id">>) => void;
  removeEvento: (id: string) => void;
};

export const useStore = create<Store>((set, get) => ({
  upas: UPAS_SEED,
  eventos: EVENTOS_SEED,
  userLoc: DEFAULT_USER_LOC,
  setUserLoc: (l) => set({ userLoc: l }),
  selectedId: null,
  setSelected: (id) => set({ selectedId: id }),
  favoritos: [],
  carregarFavoritos: () => set({ favoritos: lerFavoritos() }),
  toggleFavorito: (upaId) => {
    const atual: string[] = get().favoritos;
    const proximo = atual.includes(upaId) ? atual.filter((i) => i !== upaId) : [...atual, upaId];

    salvarFavoritos(proximo);
    set({ favoritos: proximo });
    return proximo.includes(upaId);
  },

  filter: FILTRO_PADRAO,
  setFilter: (f) => set((s) => ({ filter: { ...s.filter, ...f } })),
  resetFilter: () => set({ filter: FILTRO_PADRAO }),
  addAvaliacao: (upaId, nota, tempo, comentario) =>
    set((s) => ({
      upas: s.upas.map((u) =>
        u.id === upaId
          ? {
              ...u,
              avaliacoes: [
                { nota, tempo_real_min: tempo, comentario, criado_em: new Date().toISOString() },
                ...u.avaliacoes,
              ],
            }
          : u,
      ),
    })),
  updateUpa: (upaId, patch, origem = "manual") =>
    set((s) => ({
      upas: s.upas.map((u) =>
        u.id === upaId
          ? { ...u, ...patch, fonte_dados: origem, atualizado_em: new Date().toISOString() }
          : u,
      ),
    })),
  voltarParaSimulacao: (upaId) =>
    set((s) => ({
      upas: s.upas.map((u) =>
        u.id === upaId
          ? { ...u, fonte_dados: "simulada", atualizado_em: new Date().toISOString() }
          : u,
      ),
    })),
  addEvento: (e) =>
    set((s) => ({
      eventos: [{ ...e, id: `ev-${Date.now()}` }, ...s.eventos],
    })),
  updateEvento: (id, patch) =>
    set((s) => ({ eventos: s.eventos.map((e) => (e.id === id ? { ...e, ...patch } : e)) })),
  removeEvento: (id) =>
    set((s) => ({ eventos: s.eventos.filter((e) => e.id !== id) })),
}));
