/* eslint-disable */
'use client';
import { useEffect, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
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
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import OverlayLoading from '../OverlayLoading';
import { toast } from 'sonner';
import { Agence, Province, Function, AgenceForResponse } from '@/types';


const ITEMS_PER_PAGE = 5;

export default function AgencesClient() {
  const [agences, setAgences] = useState<AgenceForResponse[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [newName, setNewName] = useState<string>('');
  const [newCode, setNewCode] = useState<string>('');
  const [newProvinceId, setNewProvinceId] = useState<string>('');
  const [addName, setAddName] = useState<string>('');
  const [addCode, setAddCode] = useState<string>('');
  const [addProvinceId, setAddProvinceId] = useState<string>('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [agencesRes, provincesRes] = await Promise.all([
        fetch('/api/agences'),
        fetch('/api/provinces'),
      ]);
      const agencesData = await agencesRes.json();
      console.log('Agences data:', agencesData);
      
      const provincesData = await provincesRes.json();
      setAgences(agencesData);
      setProvinces(provincesData);
    } catch (error) {
      toast.error('Erreur lors du chargement des agences');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const startEdit = (agence: Agence) => {
    setEditingId(agence.id);
    setNewName(agence.name);
    setNewCode(agence.codeAgence);
    setNewProvinceId(String(agence.provinceId));
  };

  const saveEdit = async (id: number) => {
    await fetch(`/api/agences`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        name: newName,
        code: newCode,
        provinceId: Number(newProvinceId),
      }),
    });
    await fetchData();
    setEditingId(null);
    toast.success('Agence modifiée avec succès');
  };

  const confirmDelete = async () => {
    if (deleteId == null) return;
    await fetch(`/api/agences`, {
      method: 'DELETE',
      body: JSON.stringify({ id: deleteId }),
    });
    setDeleteId(null);
    await fetchData();
    toast.success('Agence supprimée avec succès');
  };

const addAgence = async () => {
  try {
    if (!addName.trim() || !addCode.trim() || !addProvinceId) return;

    const res = await fetch('/api/agences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: addName,
        code: addCode,
        provinceId: Number(addProvinceId),
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      if (data?.error?.includes('code agence existe')) {
        toast.error('Ce code agence existe déjà.');
      } else {
        toast.error('Erreur lors de l\'ajout de l\'agence');
      }
      return;
    }

    setAddName('');
    setAddCode('');
    setAddProvinceId('');
    await fetchData();
    toast.success('Agence ajoutée avec succès');
    
  } catch (error) {
    console.error(error);
    toast.error('Erreur lors de l\'ajout de l\'agence');
  }
};


  const totalPages = Math.ceil(agences.length / ITEMS_PER_PAGE);
  const paginatedAgences = agences.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return loading ? <OverlayLoading /> : (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Agences</h1>
      <div className="flex gap-2">
        <Input
          placeholder="Nom de l'agence"
          value={addName}
          onChange={(e) => setAddName(e.target.value)}
          className="w-64"
        />
        <Input
          placeholder="Code de l'agence"
          value={addCode}
          onChange={(e) => setAddCode(e.target.value)}
          className="w-40"
        />
        <Select onValueChange={(value) => setAddProvinceId(value)}>
          <SelectTrigger className="w-60">
            <SelectValue placeholder="Province" />
          </SelectTrigger>
          <SelectContent>
            {provinces.map((p) => (
              <SelectItem key={p.id} value={String(p.id)}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={addAgence}>Ajouter</Button>
      </div>
      <Separator />
      <table className="w-full table-auto border border-gray-200">
        <thead>
          <tr className="bg-gray-50 text-left">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Nom</th>
            <th className="p-2 border">Code</th>
            <th className="p-2 border">Province</th>
            <th className="p-2 border text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedAgences.map((agence) => (
            <tr key={agence.id} className="hover:bg-gray-50">
              <td className="p-2 border">{agence.id}</td>
              <td className="p-2 border">
                {editingId === agence.id ? (
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full"
                  />
                ) : (
                  agence.name
                )}
              </td>
              <td className="p-2 border">
                {editingId === agence.id ? (
                  <Input
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full"
                  />
                ) : (
                  agence.codeAgence
                )}
              </td>
              <td className="p-2 border">
                {editingId === agence.id ? (
                  <Select
                    value={newProvinceId}
                    onValueChange={(value) => setNewProvinceId(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Province" />
                    </SelectTrigger>
                    <SelectContent>
                      {provinces.map((p) => (
                        <SelectItem key={p.id} value={String(p.id)}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                 agence.province.name

                )}
              </td>
              <td className="p-2 border text-center flex justify-center gap-2">
                {editingId === agence.id ? (
                  <Button size="sm" onClick={() => saveEdit(agence.id)}>
                    Enregistrer
                  </Button>
                ) : (
                  <Button variant="ghost" size="icon" onClick={() => startEdit(agence)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                )}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(agence.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                      <AlertDialogDescription>
                        Êtes-vous sûr de vouloir supprimer cette agence ? Cette action est irréversible.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={confirmDelete}
                        className="bg-red-500 hover:bg-red-600"
                      >
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
      // Pagination controls
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
    </div>
  );
}
