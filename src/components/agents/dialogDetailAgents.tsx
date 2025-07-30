/* eslint-disable */
'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Agent, Agence, Departement, Function, Province } from '@/types';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  agent: Agent;
  agences: Agence[];
  provinces: Province[];
  departments: Departement[];
  functions: Function[];
  onAgentUpdated: (agent: Agent | null) => void;
}

export function AgentDetailDialog({
  isOpen,
  onClose,
  agent,
  agences,
  provinces,
  departments,
  functions,
  onAgentUpdated,
}: Props) {
  const [formData, setFormData] = useState<Agent>(agent);
  const [newPhotoFile, setNewPhotoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData(agent);
    setNewPhotoFile(null);
  }, [agent]);

  const handleChange = (field: keyof Agent, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewPhotoFile(file);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.url;
  };

  const deleteImage = async (url: string) => {
    await fetch('/api/delete-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let photoUrl = formData.photoUrl;

      if (newPhotoFile) {
        if (photoUrl) await deleteImage(photoUrl);
        const uploaded = await uploadImage(newPhotoFile);
        if (uploaded) photoUrl = uploaded;
      }

      const res = await fetch('/api/agents', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, photoUrl }),
      });

      if (!res.ok) throw new Error();

      const updated = await res.json();
      onAgentUpdated(updated);
      toast.success('Agent mis à jour avec succès');
      onClose();
    } catch {
      toast.error('Erreur lors de la mise à jour de l’agent.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await fetch('/api/agents', {
        method: 'DELETE',
        body: JSON.stringify({ id: formData.id }),
      });
      toast.success('Agent supprimé avec succès');
      onAgentUpdated(null);
      onClose();
    } catch {
      toast.error('Erreur lors de la suppression.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white" showCloseButton={true}>
        
        <DialogHeader>
          <DialogTitle>Détails de l’agent</DialogTitle>
          <DialogDescription>
            Modifie les informations ci-dessous et clique sur Enregistrer.
        </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Prénom"
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
          />
          <Input
            placeholder="Nom"
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
          />
          <Input
            placeholder="Téléphones"
            value={
              Array.isArray(formData.phoneNumbers)
                ? formData.phoneNumbers.join(', ')
                : formData.phoneNumbers || ''
            }
            onChange={(e) =>
              handleChange(
                'phoneNumbers',
                e.target.value.split(',').map((p) => p.trim())
              )
            }
          />

          {formData.photoUrl && (
            <img
              src={formData.photoUrl}
              alt="Photo actuelle"
              className="h-32 w-32 object-cover rounded-md border border-gray-300"
            />
          )}

          <Input type="file" accept="image/*" onChange={handlePhotoChange} />

          <Select
            value={String(formData.departementId)}
            onValueChange={(val) => handleChange('departementId', Number(val))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Département" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((d) => (
                <SelectItem key={d.id} value={String(d.id)}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={String(formData.functionId)}
            onValueChange={(val) => handleChange('functionId', Number(val))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Fonction" />
            </SelectTrigger>
            <SelectContent>
              {functions.map((f) => (
                <SelectItem key={f.id} value={String(f.id)}>
                  {f.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={String(formData.provinceId)}
            onValueChange={(val) => handleChange('provinceId', Number(val))}
          >
            <SelectTrigger>
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

          <Select
            value={String(formData.agenceId)}
            onValueChange={(val) => handleChange('agenceId', Number(val))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Agence" />
            </SelectTrigger>
            <SelectContent>
              {agences.map((a) => (
                <SelectItem key={a.id} value={String(a.id)}>
                  {a.name}({a.codeAgence})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter className="pt-4 flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && (
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-[#ffcb00] border-r-transparent" />
            )}
            Enregistrer
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={loading}>
                Supprimer l’agent
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Supprimer l'agent ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action est irréversible. L’agent et ses données associées seront supprimées définitivement.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-500 hover:bg-red-600"
                  onClick={handleDelete}
                >
                  Confirmer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
