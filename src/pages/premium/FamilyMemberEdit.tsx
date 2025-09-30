import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save, Smartphone, Clock, Check } from 'lucide-react';
import { useScreenTimeStorage } from '@/hooks/useScreenTimeStorage';
import { useToast } from '@/hooks/use-toast';
import type { DayOfWeek } from '@/types';

const POPULAR_APPS = [
  'TikTok', 'YouTube', 'Instagram', 'WhatsApp', 'Jogos',
  'Netflix', 'Spotify', 'Twitter/X', 'Facebook', 'Snapchat'
];

const DAYS: { key: DayOfWeek; label: string }[] = [
  { key: 'monday', label: 'Seg' },
  { key: 'tuesday', label: 'Ter' },
  { key: 'wednesday', label: 'Qua' },
  { key: 'thursday', label: 'Qui' },
  { key: 'friday', label: 'Sex' },
  { key: 'saturday', label: 'Sáb' },
  { key: 'sunday', label: 'Dom' },
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

  const toggleHour = (day: DayOfWeek, hour: number) => {
    setAllowedHours(prev => {
      const dayHours = prev[day] || [];
      const updated = dayHours.includes(hour)
        ? dayHours.filter(h => h !== hour)
        : [...dayHours, hour].sort((a, b) => a - b);
      return { ...prev, [day]: updated };
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
        <div className="flex items-center gap-2 mb-4">
          <Check className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2 className="text-xl font-bold">Horários Permitidos</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Marque os horários em que {member.name} PODE usar o celular. Horários não marcados = bloqueado
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2 text-xs font-medium text-left">Hora</th>
                {DAYS.map(day => (
                  <th key={day.key} className="p-2 text-xs font-medium text-center">
                    {day.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HOURS.map(hour => (
                <tr key={hour} className="border-t">
                  <td className="p-2 text-xs font-medium">{hour}h</td>
                  {DAYS.map(day => {
                    const isAllowed = allowedHours[day.key]?.includes(hour);
                    return (
                      <td key={day.key} className="p-1 text-center">
                        <button
                          onClick={() => toggleHour(day.key, hour)}
                          className={`w-8 h-8 rounded transition-colors ${
                            isAllowed
                              ? 'bg-green-500 hover:bg-green-600 text-white'
                              : 'bg-gray-200 hover:bg-gray-300'
                          }`}
                          data-testid={`hour-${day.key}-${hour}`}
                          aria-label={`${day.label} ${hour}h ${isAllowed ? 'permitido' : 'bloqueado'}`}
                        >
                          {isAllowed && <Check className="h-4 w-4 mx-auto" aria-hidden="true" />}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

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
