import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Department = {
  id: number;
  name: string;
};

type DepartmentStore = {
  departments: Department[];
  fetchDepartments: () => Promise<void>;
  addDepartment: (dep: Department) => void;
  updateDepartment: (dep: Department) => void;
  deleteDepartment: (id: number) => void;
};

export const useDepartmentStore = create<DepartmentStore>()(
  persist(
    (set, get) => ({
      departments: [],
      fetchDepartments: async () => {
        const res = await fetch('/api/departments');
        const data = await res.json();
        set({ departments: data });
      },
      addDepartment: (dep) => set({ departments: [...get().departments, dep] }),
      updateDepartment: (dep) =>
        set({
          departments: get().departments.map((d) =>
            d.id === dep.id ? dep : d
          ),
        }),
      deleteDepartment: (id) =>
        set({
          departments: get().departments.filter((d) => d.id !== id),
        }),
    }),
    {
      name: 'department-storage',
    }
  )
);
