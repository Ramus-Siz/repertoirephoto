/* eslint-disable */
'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Agent, Departement, Function } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import OverlayLoading from '@/components/OverlayLoading';
import { Image } from 'lucide-react';

export default function AdvansAgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [departments, setDepartments] = useState<Departement[]>([]);
  const [functions, setFunctions] = useState<Function[]>([]);
  const [agences, setAgences] = useState<any[]>([]);
  const [provinceFilter, setProvinceFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [agenceFilter, setAgenceFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState(false);
  


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
  try {
    const [agentsRes, depRes, funcRes, agencesRes] = await Promise.all([
      fetch('/api/agents'),
      fetch('/api/departements'),
      fetch('/api/function'),
      fetch('/api/agences'),
    ]);

    if (!agentsRes.ok || !depRes.ok || !funcRes.ok || !agencesRes.ok) {
      throw new Error('Une des requêtes a échoué.');
    }

    const [agents, departments, functions, agences] = await Promise.all([
      agentsRes.json(),
      depRes.json(),
      funcRes.json(),
      agencesRes.json(),
    ]);

    setAgents(agents.filter((a: Agent) => a.status === true));
    setDepartments(departments);
    setFunctions(functions);
    setAgences(agences);
  } catch (error) {
    console.error('Erreur lors de la récupération des données :', error);
    // Optionnel : afficher une notification ou activer un loader d'erreur
  }finally {
    setLoading(false);
  }
};


  const getDepartmentName = (id: string) =>
    departments.find((d) => String(d.id) === String(id))?.name || 'Inconnu';

  const getFunctionName = (id: string | number) =>
    functions.find((f) => String(f.id) === String(id))?.name || 'Inconnu';

  const filteredAgences = agences.filter(
    (ag) => provinceFilter === 'all' || ag.provinceId === Number(provinceFilter)
  );

  const filteredAgents = agents.filter((agent) => {
    if (departmentFilter !== 'all' && String(agent.departementId) !== departmentFilter) return false;
    if (provinceFilter !== 'all') {
      const agence = agences.find((a) => a.id === agent.agenceId);
      if (!agence || String(agence.provinceId) !== provinceFilter) return false;
    }
    if (agenceFilter !== 'all' && String(agent.agenceId) !== agenceFilter) return false;
    if (search.trim() !== '') {
      const q = search.toLowerCase();
      if (
        !agent.firstName.toLowerCase().includes(q) &&
        !agent.lastName.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    return true;
  });

  const agentsGrouped = departments.map((department) => {
    const agentsByDepartment = filteredAgents.filter(
      (a) => String(a.departementId) === String(department.id)
    );
    const agencesByDepartment = [...new Set(agentsByDepartment.map((a) => a.agenceId))];
    return {
      ...department,
      agences: agences
        .filter((ag) => agencesByDepartment.includes(ag.id))
        .map((agence) => ({
          ...agence,
          agents: agentsByDepartment.filter((a) => a.agenceId === agence.id),
        })),
    };
  });

 const AgentCard = ({ agent }: { agent: Agent }) => (
  <Card className="rounded-xl shadow-md hover:shadow-xl transition overflow-hidden group">
    <CardContent className="flex flex-col items-center p-6 space-y-4 relative">
      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-100 transition-transform duration-300 ease-in-out group-hover:scale-125">
        <img
          src={agent.photoUrl || '/images/defaultImage.png'}
          alt={`${agent.firstName} ${agent.lastName}`}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="text-center">
        <h2 className="font-semibold text-lg">
          {agent.firstName} {agent.lastName}
        </h2>
        <p className="text-sm text-[#008237]">{getFunctionName(agent.functionId)}</p>
        <p className="text-xs text-gray-400">{getDepartmentName(agent.departementId)}</p>
        <p className="text-sm font-semibold">
          {Array.isArray(agent.phoneNumbers)
            ? agent.phoneNumbers.join(', ')
            : agent.phoneNumbers}
        </p>
      </div>
    </CardContent>
  </Card>
);


  return (
    
  <div className="flex min-h-screen bg-gray-50 ">
  {/* Sidebar fixe avec logo */}
  <aside className="w-60 bg-white border-r shadow-md p-4 flex flex-col items-center sticky top-0 h-screen">
    <img src="/Advans_Congo_Logo.svg" alt="Advans Congo Logo" className="h-16 mb-6" />
    <div className="flex flex-col space-y-4 mt-6 w-full px-2">
    <div className="text-sm text-[#656564]">Filtre Répertoire Photo</div>
      <div>
        <label className="block mb-1 text-sm font-medium text-[#656564]">Département</label>
        <Select onValueChange={setDepartmentFilter} value={departmentFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Département" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept.id} value={String(dept.id)}>
                {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-[#656564]">Agence</label>
        <Select onValueChange={setAgenceFilter} value={agenceFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Agence" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            {filteredAgences.map((ag) => (
              <SelectItem key={ag.id} value={String(ag.id)}>
                {ag.name} ({ag.codeAgence})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-[#656564]">Recherche</label>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Nom ou Prénom"
          className="border rounded-md px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#008237] shadow-sm"
        />
      </div>
    </div>
  </aside>

  <main className="flex-1 p-6 overflow-auto space-y-8">
    {/* Filtres et recherche */}
    <div className='flex flex-wrap gap-4 mb-6 items-center justify-between'>
       {/* Titre section */}
            <div className="flex items-center space-x-3">
                <Image className="w-8 h-8 text-[#ffcb00]" />
                <h1 className="text-2xl font-bold text-[#656564]">Répertoire photo</h1>
            </div>
            <div className="flex flex-wrap gap-4 items-center justify-end">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Département</label>
              <Select onValueChange={setDepartmentFilter} value={departmentFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Département" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={String(dept.id)}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Agence</label>
              <Select onValueChange={setAgenceFilter} value={agenceFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Agence" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  {filteredAgences.map((ag) => (
                    <SelectItem key={ag.id} value={String(ag.id)}>
                      {ag.name} ({ag.codeAgence})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Recherche</label>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Nom ou Prénom"
                className="border rounded-md px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#008237] shadow-sm"
              />
            </div>
    </div>
    </div>
    
    <Separator />
              {loading ? (
        <OverlayLoading />
      ) : (
        agentsGrouped.map((department) =>
          department.agences.length > 0 ? (
            <div key={department.id} className="space-y-1">
              <h2 className="text-xl font-bold ">{department.name}</h2>

              {department.agences.map((agence) => (
                <div key={agence.id} className="space-y-4">
                  <h3 className="text-sm font-semibold text-[#95c11e]">
                    {agence.name} ({agence.codeAgence})
                  </h3>

                  <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {agence.agents.map((agent: Agent) => (
                      <AgentCard key={agent.id} agent={agent} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : null
        )
      )}  
      
  </main>
</div>);
}
