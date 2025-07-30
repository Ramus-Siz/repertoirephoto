import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Agent = {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumbers: string[];
  photoUrl?: string;
  status: boolean;
  departementId: number;
  functionId: number;
};

type AgentStore = {
  agents: Agent[];
  fetchAgents: () => Promise<void>;
  addAgent: (agent: Agent) => void;
  updateAgent: (agent: Agent) => void;
  deleteAgent: (id: number) => void;
};

export const useAgentStore = create<AgentStore>()(
  persist(
    (set, get) => ({
      agents: [],
      fetchAgents: async () => {
        const res = await fetch('/api/agents');
        const data = await res.json();
        set({ agents: data });
      },
      addAgent: (agent) => set({ agents: [...get().agents, agent] }),
      updateAgent: (agent) =>
        set({
          agents: get().agents.map((a) => (a.id === agent.id ? agent : a)),
        }),
      deleteAgent: (id) =>
        set({
          agents: get().agents.filter((a) => a.id !== id),
        }),
    }),
    {
      name: 'agent-storage', // Clé dans localStorage
    }
  )
);
