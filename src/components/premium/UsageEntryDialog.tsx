import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { FamilyMember } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface UsageEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: FamilyMember | null;
  onAddUsage: (memberId: string, usage: number, apps: { name: string; usage: number }[]) => void;
}

const UsageEntryDialog: React.FC<UsageEntryDialogProps> = ({
  open,
  onOpenChange,
  member,
  onAddUsage
}) => {
  const [totalUsage, setTotalUsage] = useState([0]);
  const [apps, setApps] = useState([{ name: '', usage: 0 }]);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!member) return;

    const validApps = apps.filter(app => app.name.trim() && app.usage > 0);
    
    onAddUsage(member.id, totalUsage[0], validApps);
    
    // Reset form
    setTotalUsage([0]);
    setApps([{ name: '', usage: 0 }]);
    onOpenChange(false);

    toast({
      title: "Uso registrado!",
      description: `Tempo de tela de ${member.name} foi atualizado para hoje.`,
    });
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  const addAppEntry = () => {
    setApps([...apps, { name: '', usage: 0 }]);
  };

  const removeAppEntry = (index: number) => {
    setApps(apps.filter((_, i) => i !== index));
  };

  const updateApp = (index: number, field: 'name' | 'usage', value: string | number) => {
    const newApps = [...apps];
    newApps[index] = { ...newApps[index], [field]: value };
    setApps(newApps);
  };

  const getQuickButtons = () => [
    { label: '+30min', minutes: 30 },
    { label: '+1h', minutes: 60 },
    { label: '+2h', minutes: 120 },
    { label: '+3h', minutes: 180 }
  ];

  const handleQuickAdd = (minutes: number) => {
    setTotalUsage([Math.min(totalUsage[0] + minutes, 480)]);
  };

  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registrar Uso - {member.name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label>Tempo total hoje: {formatTime(totalUsage[0])}</Label>
            <Slider
              value={totalUsage}
              onValueChange={setTotalUsage}
              max={480} // 8 horas máximo
              min={0}
              step={15}
              className="py-4"
              data-testid="slider-total-usage"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0min</span>
              <span>8h</span>
            </div>
          </div>

          {/* Botões rápidos */}
          <div className="grid grid-cols-4 gap-2">
            {getQuickButtons().map((btn) => (
              <Button
                key={btn.label}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickAdd(btn.minutes)}
                className="text-xs"
              >
                {btn.label}
              </Button>
            ))}
          </div>

          {/* Status vs Limite */}
          <div className={`p-3 rounded-lg ${
            totalUsage[0] > member.dailyLimit 
              ? 'bg-red-50 border border-red-200' 
              : totalUsage[0] > member.dailyLimit * 0.8
              ? 'bg-yellow-50 border border-yellow-200'
              : 'bg-green-50 border border-green-200'
          }`}>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Limite diário:</span>
              <span className="text-sm">{formatTime(member.dailyLimit)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className={`h-2 rounded-full ${
                  totalUsage[0] > member.dailyLimit 
                    ? 'bg-red-500' 
                    : totalUsage[0] > member.dailyLimit * 0.8
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                }`}
                style={{ width: `${Math.min((totalUsage[0] / member.dailyLimit) * 100, 100)}%` }}
              ></div>
            </div>
            {totalUsage[0] > member.dailyLimit && (
              <p className="text-xs text-red-600 mt-1">
                ⚠️ Acima do limite por {formatTime(totalUsage[0] - member.dailyLimit)}
              </p>
            )}
          </div>

          {/* Detalhes por app (opcional) */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-sm">Apps utilizados (opcional)</Label>
              <Button type="button" variant="outline" size="sm" onClick={addAppEntry}>
                + App
              </Button>
            </div>
            
            {apps.map((app, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Input
                  placeholder="Ex.: TikTok, YouTube..."
                  value={app.name}
                  onChange={(e) => updateApp(index, 'name', e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="number"
                  placeholder="Min"
                  value={app.usage || ''}
                  onChange={(e) => updateApp(index, 'usage', parseInt(e.target.value) || 0)}
                  className="w-20"
                  min="0"
                />
                {apps.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeAppEntry(index)}
                  >
                    ×
                  </Button>
                )}
              </div>
            ))}
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
            <Button type="submit" className="flex-1" data-testid="button-save-usage">
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UsageEntryDialog;