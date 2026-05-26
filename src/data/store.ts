import { create } from "zustand";
import { UPAS_SEED, type UPA, DEFAULT_USER_LOC } from "./upas";

type FilterState = {
  ordenar: "proxima" | "ocupacao" | "tempo" | "avaliacao";
  servicos: string[];
  apenasAbertas: boolean;
  apenasBaixaOcupacao: boolean;
};

type Store = {
  upas: UPA[];
  userLoc: { lat: number; lng: number };
  setUserLoc: (l: { lat: number; lng: number }) => void;
  selectedId: string | null;
  setSelected: (id: string | null) => void;
  filter: FilterState;
  setFilter: (f: Partial<FilterState>) => void;
  resetFilter: () => void;
  addAvaliacao: (upaId: string, nota: number, tempo: number, comentario: string) => void;
};

const defaultFilter: FilterState = {
  ordenar: "proxima",
  servicos: [],
  apenasAbertas: false,
  apenasBaixaOcupacao: false,
};

export const useStore = create<Store>((set) => ({
  upas: UPAS_SEED,
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
}));
