/* eslint-disable */
'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Agent, Departement, Function } from '@/types';
import { AddAgentDialog } from '@/components/agents/addAgent';
import { AgentDetailDialog } from '@/components/agents/dialogDetailAgents';
import OverlayLoading from '../OverlayLoading';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface AgentsPageProps {
  withButton?: boolean;
}

export default function AgentsPage({ withButton = true }: AgentsPageProps) {
  const [loading, setLoading] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [departments, setDepartments] = useState<Departement[]>([]);
  const [functions, setFunctions] = useState<Function[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [provinceFilter, setProvinceFilter] = useState<string>('all');
  const [agenceFilter, setAgenceFilter] = useState<string>('all');

  const [agences, setAgences] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);

  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const AGENTS_PER_PAGE = 6;

  useEffect(() => {
    fetchAgents();

    const fetchAgences = async () => {
      const res = await fetch('/api/agences');
      const data = await res.json();
      setAgences(data);
    };

    const fetchProvinces = async () => {
      const res = await fetch('/api/provinces');
      const data = await res.json();
      setProvinces(data);
    };

    const fetchDepartments = async () => {
      const res = await fetch('/api/departements');
      const data = await res.json();
      setDepartments(data);
    };

    const fetchFunctions = async () => {
      const res = await fetch('/api/function');
      const data = await res.json();
      setFunctions(data);
    };

    fetchAgences();
    fetchProvinces();
    fetchDepartments();
    fetchFunctions();
  }, []);

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/agents');
      const data = await res.json();
      setAgents(data);
    } catch (error) {
      console.error('Erreur lors du chargement des agents', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, departmentFilter, provinceFilter, agenceFilter]);

  useEffect(() => {
    setAgenceFilter('all');
  }, [provinceFilter]);

  const getDepartmentName = (id: string) =>
    departments.find((d) => String(d.id) === String(id))?.name || 'Inconnu';

  const getFunctionName = (id: string | number) =>
    functions.find((f) => String(f.id) === String(id))?.name || 'Inconnu';

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await fetch(`/api/agents`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: !currentStatus }),
      });
      setAgents((prev) =>
        prev.map((agent) =>
          agent.id === Number(id) ? { ...agent, status: !currentStatus } : agent
        )
      );
      toast.success('Statut de l\'agent mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors du changement de statut de l\'agent', error);
      toast.error('Erreur lors du changement de statut de l\'agent');
    }
  };

  const filteredAgences = agences.filter(
    (ag) => provinceFilter === 'all' || ag.provinceId === Number(provinceFilter)
  );

  const filteredAgents = agents.filter((agent) => {
    if (statusFilter === 'active' && agent.status !== true) return false;
    if (statusFilter === 'inactive' && agent.status === true) return false;
    if (departmentFilter !== 'all' && String(agent.departementId) !== departmentFilter) return false;
    if (provinceFilter !== 'all') {
      const agence = agences.find((a) => a.id === agent.agenceId);
      if (!agence || String(agence.provinceId) !== provinceFilter) return false;
    }
    if (agenceFilter !== 'all' && String(agent.agenceId) !== agenceFilter) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredAgents.length / AGENTS_PER_PAGE);
  const paginatedAgents = filteredAgents.slice(
    (currentPage - 1) * AGENTS_PER_PAGE,
    currentPage * AGENTS_PER_PAGE
  );

  return loading ? (
    <OverlayLoading />
  ) : (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        {withButton && <h1 className="text-2xl font-bold">Liste des agents</h1>}
        {withButton && (
          <AddAgentDialog
            departments={departments}
            functions={functions}
            onAgentAdded={fetchAgents}
            agences={agences}
          />
        )}
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <div>
          <label className="block mb-1 font-medium">Statut</label>
          <Select onValueChange={(value) => setStatusFilter(value as 'all' | 'active' | 'inactive')} value={statusFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="hover:bg-primary/10">Tous</SelectItem>
                  <SelectItem value="active" className="hover:bg-primary/10">Actifs</SelectItem>
                  <SelectItem value="inactive" className="hover:bg-primary/10">Inactifs</SelectItem>
                </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Département</label>
          <Select onValueChange={setDepartmentFilter} value={departmentFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Département" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={String(dept.id)} className="hover:bg-primary/10">
                  {dept.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        </div>


        <div>
        <label className="block mb-1 font-medium">Agence</label>
         <Select onValueChange={setAgenceFilter} value={agenceFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Agence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                {filteredAgences.map((ag) => (
                  <SelectItem key={ag.id} value={String(ag.id)} className="hover:bg-primary/10">
                    {ag.name} ({ag.codeAgence})
                  </SelectItem>
                ))}
              </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {paginatedAgents.map((agent) => (
          <Card key={agent.id} className="hover:shadow-xl transition-shadow rounded-xl">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-start gap-4">
                <img
                  src={agent.photoUrl || '/images/defaultImage.png'}
                  alt={`${agent.firstName} ${agent.lastName}`}
                  className="w-16 h-16 rounded-full object-cover border"
                />
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">
                    {agent.firstName} {agent.lastName}
                  </h2>
                  <p className="text-sm text-muted-foreground">{getFunctionName(agent.functionId)}</p>
                  {agent.engagementDate && (
                    <p className="text-sm text-muted-foreground">
                      Depuis {agent.engagementDate.split('-').reverse().join('/')}
                    </p>
                  )}
                  <p className="text-sm font-semibold text-muted-foreground">
                    {getDepartmentName(agent.departementId)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {Array.isArray(agent.phoneNumbers)
                      ? agent.phoneNumbers.join(', ')
                      : agent.phoneNumbers}
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <Badge variant={agent.status === true ? 'default' : 'secondary'}>
                  {agent.status === true ? 'Actif' : 'Inactif'}
                </Badge>
                <Switch
                  checked={agent.status === true}
                  onCheckedChange={() => toggleStatus(String(agent.id), agent.status)}
                  disabled={!withButton}
                />
              </div>
              <Button
                variant="outline"
                className="w-full cursor-pointer"
                onClick={() => withButton && setSelectedAgent(agent) || setIsDetailOpen(true)}
                disabled={!withButton}
              >
                Voir les détails
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between items-center pt-6">
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          Précédent
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {currentPage} sur {totalPages}
        </span>
        <Button
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        >
          Suivant
        </Button>
      </div>

      {selectedAgent && (
        <AgentDetailDialog
          isOpen={isDetailOpen}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedAgent(null);
          }}
          agent={selectedAgent}
          departments={departments}
          functions={functions}
          onAgentUpdated={() => fetchAgents()}
          agences={agences}
          provinces={provinces}
        />
      )}
    </div>
  );
}
