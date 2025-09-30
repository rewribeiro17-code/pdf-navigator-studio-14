import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Smartphone, Clock, Check, Plus, X } from 'lucide-react';
import { useScreenTimeStorage } from '@/hooks/useScreenTimeStorage';
import { useToast } from '@/hooks/use-toast';
import type { DayOfWeek } from '@/types';

const POPULAR_APPS = [
  'TikTok', 'YouTube', 'Instagram', 'WhatsApp', 'Jogos',
  'Netflix', 'Spotify', 'Twitter/X', 'Facebook', 'Snapchat'
];

const DAYS: { key: DayOfWeek; label: string }[] = [
  { key: 'monday', label: 'Segunda-feira' },
  { key: 'tuesday', label: 'Terça-feira' },
  { key: 'wednesday', label: 'Quarta-feira' },
  { key: 'thursday', label: 'Quinta-feira' },
  { key: 'friday', label: 'Sexta-feira' },
  { key: 'saturday', label: 'Sábado' },
  { key: 'sunday', label: 'Domingo' },
];

const HOURS = Array.from({ length: 24 }, (_, i) => i);

const FamilyMemberEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { familyMembers, updateFamilyMember } = useScreenTimeStorage();
  const { toast } = useToast();

  const member = familyMembers.find(m => m.id === id);

  const [selectedApps, setSelectedApps] = useState<string[]>(member?.apps || []);
  const [appLimits, setAppLimits] = useState<Record<string, number>>(member?.appLimits || {});
  const [allowedHours, setAllowedHours] = useState<Partial<Record<DayOfWeek, number[]>>>(
    member?.allowedHours || {}
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek | ''>('');
  const [selectedHours, setSelectedHours] = useState<number[]>([]);

  useEffect(() => {
    if (member) {
      setSelectedApps(member.apps || []);
      setAppLimits(member.appLimits || {});
      setAllowedHours(member.allowedHours || {});
    }
  }, [member]);

  if (!member) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Membro não encontrado</p>
        <Button onClick={() => navigate('/premium/family')} className="mt-4">
          Voltar
        </Button>
      </div>
    );
  }

  const toggleApp = (app: string) => {
    setSelectedApps(prev =>
      prev.includes(app) ? prev.filter(a => a !== app) : [...prev, app]
    );
  };

  const updateAppLimit = (app: string, limit: string) => {
    const value = parseInt(limit) || 0;
    setAppLimits(prev => ({ ...prev, [app]: value }));
  };

  const toggleHourInDialog = (hour: number) => {
    setSelectedHours(prev =>
      prev.includes(hour) ? prev.filter(h => h !== hour) : [...prev, hour].sort((a, b) => a - b)
    );
  };

  const addAllowedHours = () => {
    if (!selectedDay || selectedHours.length === 0) {
      toast({
        title: 'Atenção',
        description: 'Selecione um dia e pelo menos um horário.',
        variant: 'destructive',
      });
      return;
    }

    setAllowedHours(prev => ({
      ...prev,
      [selectedDay]: [...new Set([...(prev[selectedDay] || []), ...selectedHours])].sort((a, b) => a - b),
    }));

    setIsDialogOpen(false);
    setSelectedDay('');
    setSelectedHours([]);

    toast({
      title: 'Horários adicionados!',
      description: `Horários configurados para ${DAYS.find(d => d.key === selectedDay)?.label}`,
    });
  };

  const removeDay = (day: DayOfWeek) => {
    setAllowedHours(prev => {
      const updated = { ...prev };
      delete updated[day];
      return updated;
    });
  };

  const removeHour = (day: DayOfWeek, hour: number) => {
    setAllowedHours(prev => {
      const dayHours = (prev[day] || []).filter(h => h !== hour);
      if (dayHours.length === 0) {
        const updated = { ...prev };
        delete updated[day];
        return updated;
      }
      return { ...prev, [day]: dayHours };
    });
  };

  const handleSave = () => {
    updateFamilyMember(member.id, {
      apps: selectedApps,
      appLimits,
      allowedHours,
    });

    toast({
      title: 'Perfil atualizado!',
      description: `As configurações de ${member.name} foram salvas com sucesso.`,
    });

    navigate('/premium/family');
  };

  return (
    <div className="animate-fade-in">
      <Button
        variant="ghost"
        onClick={() => navigate('/premium/family')}
        className="mb-6 hover:bg-primary/10"
        data-testid="button-back-family"
      >
        <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
        Voltar
      </Button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Perfil de {member.name}</h1>
        <p className="text-muted-foreground">
          Configure os apps, limites e horários permitidos
        </p>
      </div>

      {/* Apps que usa */}
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Smartphone className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2 className="text-xl font-bold">Apps que Usa</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Selecione os aplicativos que {member.name} costuma usar
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {POPULAR_APPS.map(app => (
            <div key={app} className="flex items-center space-x-2">
              <Checkbox
                id={`app-${app}`}
                checked={selectedApps.includes(app)}
                onCheckedChange={() => toggleApp(app)}
                data-testid={`checkbox-app-${app}`}
              />
              <Label
                htmlFor={`app-${app}`}
                className="text-sm font-medium cursor-pointer"
              >
                {app}
              </Label>
            </div>
          ))}
        </div>
      </Card>

      {/* Limites por App */}
      {selectedApps.length > 0 && (
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 className="text-xl font-bold">Limites por App</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Defina o tempo máximo permitido por dia para cada app (em minutos)
          </p>
          <div className="space-y-3">
            {selectedApps.map(app => (
              <div key={app} className="flex items-center gap-3">
                <Label className="w-32 text-sm font-medium">{app}</Label>
                <Input
                  type="number"
                  value={appLimits[app] || ''}
                  onChange={(e) => updateAppLimit(app, e.target.value)}
                  placeholder="Ex: 30"
                  min="0"
                  max="480"
                  className="w-24"
                  data-testid={`input-limit-${app}`}
                />
                <span className="text-sm text-muted-foreground">min/dia</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Horários Permitidos */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 className="text-xl font-bold">Horários Permitidos</h2>
          </div>
          <Button
            onClick={() => setIsDialogOpen(true)}
            size="sm"
            className="bg-teal-600 hover:bg-teal-700"
            data-testid="button-add-schedule"
          >
            <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
            Adicionar Horário
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Defina os horários em que {member.name} PODE usar o celular
        </p>

        {Object.keys(allowedHours).length === 0 ? (
          <div className="text-center py-8 bg-muted/50 rounded-lg">
            <Clock className="h-12 w-12 mx-auto mb-3 text-muted-foreground" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">
              Nenhum horário configurado. Clique em "Adicionar Horário" para começar.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {DAYS.map(day => {
              const hours = allowedHours[day.key];
              if (!hours || hours.length === 0) return null;

              return (
                <div
                  key={day.key}
                  className="p-4 bg-muted/50 rounded-lg"
                  data-testid={`schedule-${day.key}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{day.label}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDay(day.key)}
                      className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                      data-testid={`button-remove-day-${day.key}`}
                    >
                      <X className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {hours.map(hour => (
                      <Badge
                        key={hour}
                        variant="secondary"
                        className="gap-1 pr-1"
                        data-testid={`badge-hour-${day.key}-${hour}`}
                      >
                        {hour}h
                        <button
                          onClick={() => removeHour(day.key, hour)}
                          className="ml-1 hover:text-destructive"
                          data-testid={`button-remove-hour-${day.key}-${hour}`}
                        >
                          <X className="h-3 w-3" aria-hidden="true" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Dialog para adicionar horários */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]" data-testid="dialog-add-schedule">
          <DialogHeader>
            <DialogTitle>Adicionar Horários Permitidos</DialogTitle>
            <DialogDescription>
              Selecione o dia da semana e os horários em que {member.name} pode usar o celular
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Dia da Semana</Label>
              <Select value={selectedDay} onValueChange={(value) => setSelectedDay(value as DayOfWeek)}>
                <SelectTrigger data-testid="select-day">
                  <SelectValue placeholder="Selecione um dia" />
                </SelectTrigger>
                <SelectContent>
                  {DAYS.map(day => (
                    <SelectItem key={day.key} value={day.key}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Horários Permitidos</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Clique nos horários para selecioná-los
              </p>
              <div className="grid grid-cols-6 gap-2 max-h-64 overflow-y-auto p-2 border rounded-lg">
                {HOURS.map(hour => {
                  const isSelected = selectedHours.includes(hour);
                  return (
                    <Button
                      key={hour}
                      variant={isSelected ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleHourInDialog(hour)}
                      className={isSelected ? 'bg-teal-600 hover:bg-teal-700' : ''}
                      data-testid={`button-hour-${hour}`}
                    >
                      {hour}h
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} data-testid="button-dialog-cancel">
              Cancelar
            </Button>
            <Button
              onClick={addAllowedHours}
              className="bg-teal-600 hover:bg-teal-700"
              data-testid="button-dialog-confirm"
            >
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Botão Salvar */}
      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => navigate('/premium/family')}
          data-testid="button-cancel"
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          className="bg-teal-600 hover:bg-teal-700"
          data-testid="button-save"
        >
          <Save className="h-4 w-4 mr-2" aria-hidden="true" />
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
};

export default FamilyMemberEdit;
