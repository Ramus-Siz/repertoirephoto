/* eslint-disable */
'use client';
import { useEffect, useState } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTrigger,
  AlertDialogTitle,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Departement, Agent } from '@/types';
import OverlayLoading from '../OverlayLoading';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 5;

export default function DepartementsClient() {
  const [departments, setDepartments] = useState<Departement[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newName, setNewName] = useState<string>('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [deptRes, agentRes] = await Promise.all([
        fetch('/api/departements'),
        fetch('/api/agents'),
      ]);
      const [deptData, agentData] = await Promise.all([
        deptRes.json(),
        agentRes.json(),
      ]);

      setDepartments(deptData);
      setAgents(agentData);
    } catch (error) {
      console.error('Erreur lors du chargement des départements', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getAgentCount = (deptId: number) => {
    return agents.filter((agent) => Number(agent.departementId) === deptId).length;
  };

  const startEdit = (dept: Departement) => {
    setEditingId(Number(dept.id));
    setNewName(dept.name);
  };

  const saveEdit = async (id: number) => {
    await fetch(`/api/departements`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, name: newName }),
    });
    await fetchData();
    setEditingId(null);
    setNewName('');
    toast.success('Departement modifié avec succès');
  };

  const confirmDelete = async () => {
    if (deleteId == null) return;
    const agentCount = getAgentCount(deleteId);
    if (agentCount > 0) {
      alert("Ce département est lié à des agents et ne peut pas être supprimé.");
      return;
    }
    await fetch(`/api/departements`, {
      method: 'DELETE',
      body: JSON.stringify({ id: deleteId }),
    });
    setDeleteId(null);
    await fetchData();
    toast.success('Departement supprimé avec succès');
  };

  const handleAddDepartment = async () => {
    try {
        if (!newDepartmentName.trim()) return;
      const res= await fetch('/api/departements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newDepartmentName.trim() }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Erreur lors de l\'ajout du département');
      }
      setNewDepartmentName('');
      setShowAddDialog(false);
      await fetchData();
      toast.success('Departement ajouté avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'ajout du département');
      console.error('Erreur lors de l\'ajout du département', error);
    }

  };

  const totalPages = Math.ceil(departments.length / ITEMS_PER_PAGE);
  const paginatedDepartments = departments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    isLoading ? <OverlayLoading /> :
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Départements</h1>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="w-4 h-4 mr-2" /> Ajouter un département
        </Button>
      </div>
      <Separator />
      <table className="w-full table-auto border border-gray-200">
        <thead>
          <tr className="bg-gray-50 text-left">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Nom</th>
            <th className="p-2 border">Nombre d'agents</th>
            <th className="p-2 border text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedDepartments.map((dept) => (
            <tr key={dept.id} className="hover:bg-gray-50">
              <td className="p-2 border">{dept.id}</td>
              <td className="p-2 border">
                {editingId === Number(dept.id) ? (
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full"
                  />
                ) : (
                  dept.name
                )}
              </td>
              <td className="p-2 border">{getAgentCount(Number(dept.id))}</td>
              <td className="p-2 border text-center flex justify-center gap-2">
                {editingId === Number(dept.id) ? (
                  <Button size="sm" onClick={() => saveEdit(Number(dept.id))}>
                    Enregistrer
                  </Button>
                ) : (
                  <Button variant="ghost" size="icon" onClick={() => startEdit(dept)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                )}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(Number(dept.id))}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                      <AlertDialogDescription>
                        Êtes-vous sûr de vouloir supprimer ce département ? Cette action est irréversible.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center pt-4">
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Précédent
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {currentPage} sur {totalPages}
        </span>
        <Button
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Suivant
        </Button>
      </div>

      {showAddDialog && (
        <AlertDialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Ajouter un département</AlertDialogTitle>
              <AlertDialogDescription>
                Entrez le nom du nouveau département.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <Input
              value={newDepartmentName}
              onChange={(e) => setNewDepartmentName(e.target.value)}
              placeholder="Nom du département"
            />
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleAddDepartment}>Ajouter</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
