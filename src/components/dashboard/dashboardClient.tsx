 
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Landmark, UserCheck, Users } from 'lucide-react';
import OverlayLoading from '../OverlayLoading';

export default function DashboardClient() {
  const router = useRouter();
  const [stats, setStats] = useState({ agents: 0, activeAgents: 0, departments: 0, agences: 0 });
  const [loading, setLoading] = useState(false);

  const stylBoutonRacourcis =
    'w-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white py-3 cursor-pointer px-4 rounded-md hover:bg-[#95c11e] hover:text-white dark:hover:bg-gray-700';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [agentsRes, departmentsRes, agencesRes] = await Promise.all([
          fetch('/api/agents'),
          fetch('/api/departements'),
          fetch('/api/agences'),
        ]);

        if (!agentsRes.ok || !departmentsRes.ok || !agencesRes.ok) {
          throw new Error('Erreur lors de la récupération des données');
        }

        const agents = await agentsRes.json();
        const departments = await departmentsRes.json();
        const agences = await agencesRes.json();

        const activeAgents = agents.filter((agent: any) => agent.status === true);

        setStats({
          agents: agents.length,
          activeAgents: activeAgents.length,
          departments: departments.length,
          agences: agences.length,
        });
      } catch (error) {
        console.error('Erreur lors du fetch des données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const StatCard = ({
    title,
    value,
    icon,
  }: {
    title: string;
    value: number;
    icon: React.ReactNode;
  }) => (
    <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h4>
          <p className="text-4xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
        <div className="text-gray-400 dark:text-gray-600 text-4xl">{icon}</div>
      </div>
    </div>
  );

  return loading ? (
    <OverlayLoading />
  ) : (
    <div className="flex flex-1 flex-col gap-6">
      <div className="grid gap-6 md:grid-cols-4">
        <StatCard
          title="Agents enregistrés"
          value={stats.agents}
          icon={<Users className="w-10 h-10 text-[#95c11e]" />}
        />
        <StatCard
          title="Agents actifs"
          value={stats.activeAgents}
          icon={<UserCheck className="w-10 h-10 text-[#95c11e]" />}
        />
        <StatCard
          title="Départements"
          value={stats.departments}
          icon={<Building2 className="w-10 h-10 text-[#95c11e]" />}
        />
        <StatCard
          title="Agences"
          value={stats.agences}
          icon={<Landmark className="w-10 h-10 text-[#95c11e]" />}
        />
      </div>

      <div className="mt-8 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-white mb-4">Gérer les données</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <button
            onClick={() => router.push('/admin/agents')}
            className={stylBoutonRacourcis}
          >
            Agents
          </button>
          <button
            onClick={() => router.push('/admin/departements')}
            className={stylBoutonRacourcis}
          >
            Départements
          </button>
          <button
            onClick={() => router.push('/admin/fonctions')}
            className={stylBoutonRacourcis}
          >
            Fonctions
          </button>
        </div>
      </div>
    </div>
  );
}
