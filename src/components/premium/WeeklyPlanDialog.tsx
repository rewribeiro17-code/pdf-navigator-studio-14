import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FamilyMember, Activity } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface WeeklyPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: FamilyMember | null;
  activities: Activity[];
  onCreatePlan: (activities: { day: string; activityId: string }[]) => void;
  existingPlan?: { day: string; activity: Activity; completed: boolean }[] | null;
}

const weekDays = [
  { key: 'segunda', label: 'Segunda-feira', short: 'SEG' },
  { key: 'terca', label: 'Terça-feira', short: 'TER' },
  { key: 'quarta', label: 'Quarta-feira', short: 'QUA' },
  { key: 'quinta', label: 'Quinta-feira', short: 'QUI' },
  { key: 'sexta', label: 'Sexta-feira', short: 'SEX' },
  { key: 'sabado', label: 'Sábado', short: 'SAB' },
  { key: 'domingo', label: 'Domingo', short: 'DOM' },
];

const WeeklyPlanDialog: React.FC<WeeklyPlanDialogProps> = ({
  open,
  onOpenChange,
  member,
  activities,
  onCreatePlan,
  existingPlan
}) => {
  const [selectedActivities, setSelectedActivities] = useState<Record<string, string>>({});
  const { toast } = useToast();

  // Load existing plan when dialog opens
  useEffect(() => {
    if (open && existingPlan) {
      const planMap: Record<string, string> = {};
      existingPlan.forEach(({ day, activity }) => {
        planMap[day] = activity.id;
      });
      setSelectedActivities(planMap);
    } else if (open) {
      setSelectedActivities({});
    }
  }, [open, existingPlan]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!member) return;

    const planActivities = Object.entries(selectedActivities)
      .filter(([_, activityId]) => activityId && activityId !== 'none')
      .map(([day, activityId]) => ({ day, activityId }));

    if (planActivities.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos uma atividade para criar o plano.",
        variant: "destructive",
      });
      return;
    }

    onCreatePlan(planActivities);
    onOpenChange(false);

    toast({
      title: "Plano atualizado!",
      description: `Plano semanal de ${member.name} foi atualizado com ${planActivities.length} atividades.`,
    });
  };

  const handleActivityChange = (day: string, activityId: string) => {
    setSelectedActivities(prev => ({
      ...prev,
      [day]: activityId === 'none' ? '' : activityId
    }));
  };

  const getSelectedActivity = (activityId: string) => {
    return activities.find(a => a.id === activityId);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Planejar Semana - {member.name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {activities.length === 0 && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                Nenhuma atividade encontrada. Crie algumas atividades primeiro para poder fazer o planejamento semanal.
              </p>
            </div>
          )}

          <div className="grid gap-4">
            {weekDays.map((day) => {
              const selectedActivityId = selectedActivities[day.short];
              const selectedActivity = selectedActivityId ? getSelectedActivity(selectedActivityId) : null;
              
              return (
                <div key={day.key} className="space-y-2">
                  <Label className="font-medium">{day.label}</Label>
                  <div className="flex gap-3 items-center">
                    <Select
                      value={selectedActivityId || ''}
                      onValueChange={(value) => handleActivityChange(day.short, value)}
                    >
                      <SelectTrigger className="flex-1" data-testid={`select-${day.short.toLowerCase()}`}>
                        <SelectValue placeholder="Selecione uma atividade..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Nenhuma atividade</SelectItem>
                        {activities.map((activity) => (
                          <SelectItem key={activity.id} value={activity.id}>
                            {activity.icon} {activity.title} ({formatDuration(activity.duration)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {selectedActivity && (
                      <div className="text-sm text-muted-foreground whitespace-nowrap">
                        {selectedActivity.icon} {formatDuration(selectedActivity.duration)}
                      </div>
                    )}
                  </div>
                  
                  {selectedActivity && (
                    <p className="text-xs text-muted-foreground pl-1">
                      {selectedActivity.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              data-testid="button-cancel-plan"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={activities.length === 0}
              data-testid="button-save-plan"
            >
              {existingPlan ? 'Atualizar Plano' : 'Criar Plano'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WeeklyPlanDialog;