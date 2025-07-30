import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Func = {
  id: number;
  name: string;
};

type FunctionStore = {
  functions: Func[];
  fetchFunctions: () => Promise<void>;
  addFunction: (f: Func) => void;
  updateFunction: (f: Func) => void;
  deleteFunction: (id: number) => void;
};

export const useFunctionStore = create<FunctionStore>()(
  persist(
    (set, get) => ({
      functions: [],
      fetchFunctions: async () => {
        const res = await fetch('/api/functions');
        const data = await res.json();
        set({ functions: data });
      },
      addFunction: (f) => set({ functions: [...get().functions, f] }),
      updateFunction: (f) =>
        set({
          functions: get().functions.map((fn) =>
            fn.id === f.id ? f : fn
          ),
        }),
      deleteFunction: (id) =>
        set({
          functions: get().functions.filter((f) => f.id !== id),
        }),
    }),
    {
      name: 'function-storage',
    }
  )
);
