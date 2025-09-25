import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddMember: (member: { name: string; age: number; dailyLimit: number }) => void;
}

const AddMemberDialog: React.FC<AddMemberDialogProps> = ({
  open,
  onOpenChange,
  onAddMember
}) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState(8);
  const [dailyLimit, setDailyLimit] = useState([120]); // Slider expects array
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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

    onAddMember({
      name: name.trim(),
      age,
      dailyLimit: dailyLimit[0]
    });

    // Reset form
    setName('');
    setAge(8);
    setDailyLimit([120]);
    onOpenChange(false);

    toast({
      title: "Membro adicionado!",
      description: `${name} foi adicionado à família com sucesso.`,
    });
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  const getSuggestedLimit = (age: number) => {
    if (age <= 6) return 60; // 1h para crianças pequenas
    if (age <= 12) return 120; // 2h para crianças
    if (age <= 17) return 180; // 3h para adolescentes
    return 240; // 4h para adultos
  };

  const handleAgeChange = (newAge: number) => {
    setAge(newAge);
    setDailyLimit([getSuggestedLimit(newAge)]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Membro da Família</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: João, Maria, Pai, Mãe..."
              data-testid="input-member-name"
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
              onChange={(e) => handleAgeChange(parseInt(e.target.value) || 8)}
              data-testid="input-member-age"
            />
          </div>

          <div className="space-y-3">
            <Label>Limite diário de tela: {formatTime(dailyLimit[0])}</Label>
            <Slider
              value={dailyLimit}
              onValueChange={setDailyLimit}
              max={480} // 8 horas máximo
              min={30}  // 30 minutos mínimo
              step={15}
              className="py-4"
              data-testid="slider-daily-limit"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>30min</span>
              <span>8h</span>
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-700">
              💡 <strong>Sugestão por idade:</strong>
            </p>
            <ul className="text-xs text-blue-600 mt-1 space-y-1">
              <li>• 2-6 anos: 1h por dia</li>
              <li>• 7-12 anos: 1-2h por dia</li>
              <li>• 13-17 anos: 2-3h por dia</li>
              <li>• Adultos: Defina suas próprias metas</li>
            </ul>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" data-testid="button-add-member">
              Adicionar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberDialog;