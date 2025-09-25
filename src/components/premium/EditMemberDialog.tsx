import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { FamilyMember } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface EditMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: FamilyMember | null;
  onUpdateMember: (id: string, updates: Partial<FamilyMember>) => void;
  onRemoveMember: (id: string) => void;
}

const EditMemberDialog: React.FC<EditMemberDialogProps> = ({
  open,
  onOpenChange,
  member,
  onUpdateMember,
  onRemoveMember
}) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState(8);
  const [dailyLimit, setDailyLimit] = useState([120]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (member) {
      setName(member.name);
      setAge(member.age);
      setDailyLimit([member.dailyLimit]);
      setShowDeleteConfirm(false);
    }
  }, [member]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!member) return;

    if (!name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, insira o nome do membro da família.",
        variant: "destructive"
      });
      return;
    }

    if (age < 1 || age > 99) {
      toast({
        title: "Idade inválida",
        description: "A idade deve estar entre 1 e 99 anos.",
        variant: "destructive"
      });
      return;
    }

    onUpdateMember(member.id, {
      name: name.trim(),
      age,
      dailyLimit: dailyLimit[0]
    });

    onOpenChange(false);

    toast({
      title: "Membro atualizado!",
      description: `Dados de ${name} foram atualizados com sucesso.`,
    });
  };

  const handleDelete = () => {
    if (!member) return;
    
    onRemoveMember(member.id);
    onOpenChange(false);
    setShowDeleteConfirm(false);

    toast({
      title: "Membro removido",
      description: `${member.name} foi removido da família.`,
    });
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar {member.name}</DialogTitle>
        </DialogHeader>

        {!showDeleteConfirm ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: João, Maria, Pai, Mãe..."
                data-testid="input-edit-name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Idade: {age} anos</Label>
              <Input
                id="age"
                type="number"
                min="1"
                max="99"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value) || 8)}
                data-testid="input-edit-age"
              />
            </div>

            <div className="space-y-3">
              <Label>Limite diário de tela: {formatTime(dailyLimit[0])}</Label>
              <Slider
                value={dailyLimit}
                onValueChange={setDailyLimit}
                max={480}
                min={30}
                step={15}
                className="py-4"
                data-testid="slider-edit-limit"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>30min</span>
                <span>8h</span>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex-1"
              >
                Remover
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" className="flex-1" data-testid="button-update-member">
                Salvar
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-800 mb-2">Confirmar Remoção</h3>
              <p className="text-sm text-red-700">
                Tem certeza que deseja remover <strong>{member.name}</strong> da família? 
                Todos os dados de uso e histórico serão perdidos permanentemente.
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="flex-1"
                data-testid="button-confirm-delete"
              >
                Sim, Remover
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditMemberDialog;