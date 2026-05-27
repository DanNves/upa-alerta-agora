import { create } from "zustand";
import { UPAS_SEED, EVENTOS_SEED, type UPA, type Evento, DEFAULT_USER_LOC } from "./upas";

type FilterState = {
  ordenar: "proxima" | "ocupacao" | "tempo" | "avaliacao";
  servicos: string[];
  apenasAbertas: boolean;
  apenasBaixaOcupacao: boolean;
};

type Store = {
  upas: UPA[];
  eventos: Evento[];
  userLoc: { lat: number; lng: number };
  setUserLoc: (l: { lat: number; lng: number }) => void;
  selectedId: string | null;
  setSelected: (id: string | null) => void;
  filter: FilterState;
  setFilter: (f: Partial<FilterState>) => void;
  resetFilter: () => void;
  addAvaliacao: (upaId: string, nota: number, tempo: number, comentario: string) => void;
  updateUpa: (upaId: string, patch: Partial<UPA>) => void;
  addEvento: (e: Omit<Evento, "id">) => void;
  removeEvento: (id: string) => void;
};

const defaultFilter: FilterState = {
  ordenar: "proxima",
  servicos: [],
  apenasAbertas: false,
  apenasBaixaOcupacao: false,
};

export const useStore = create<Store>((set) => ({
  upas: UPAS_SEED,
  eventos: EVENTOS_SEED,
  userLoc: DEFAULT_USER_LOC,
  setUserLoc: (l) => set({ userLoc: l }),
  selectedId: null,
  setSelected: (id) => set({ selectedId: id }),
  filter: defaultFilter,
  setFilter: (f) => set((s) => ({ filter: { ...s.filter, ...f } })),
  resetFilter: () => set({ filter: defaultFilter }),
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
  updateUpa: (upaId, patch) =>
    set((s) => ({
      upas: s.upas.map((u) =>
        u.id === upaId ? { ...u, ...patch, atualizado_em: new Date().toISOString() } : u,
      ),
    })),
  addEvento: (e) =>
    set((s) => ({
      eventos: [{ ...e, id: `ev-${Date.now()}` }, ...s.eventos],
    })),
  removeEvento: (id) =>
    set((s) => ({ eventos: s.eventos.filter((e) => e.id !== id) })),
}));
