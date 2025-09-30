import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save, Calendar } from 'lucide-react';
import { useScreenTimeStorage } from '@/hooks/useScreenTimeStorage';
import { useDailyLogs } from '@/hooks/useDailyLogs';
import { useToast } from '@/hooks/use-toast';

const HOURS = Array.from({ length: 16 }, (_, i) => i + 7); // 7h às 22h

const DailyLogForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const memberId = searchParams.get('memberId');
  const { familyMembers } = useScreenTimeStorage();
  const { addDailyLog } = useDailyLogs();
  const { toast } = useToast();

  const member = familyMembers.find(m => m.id === memberId);
  const today = new Date().toISOString().split('T')[0];

  const [date, setDate] = useState(today);
  const [actualHoursUsed, setActualHoursUsed] = useState<number[]>([]);
  const [appsUsed, setAppsUsed] = useState<string[]>([]);
  const [behaviorWithPhone, setBehaviorWithPhone] = useState('');
  const [behaviorWithoutPhone, setBehaviorWithoutPhone] = useState('');
  const [notes, setNotes] = useState('');

  if (!member) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Selecione um membro da família</p>
        <Button onClick={() => navigate('/premium/weekly-reports')} className="mt-4">
          Voltar
        </Button>
      </div>
    );
  }

  const toggleHour = (hour: number) => {
    setActualHoursUsed(prev =>
      prev.includes(hour) ? prev.filter(h => h !== hour) : [...prev, hour].sort((a, b) => a - b)
    );
  };

  const toggleApp = (app: string) => {
    setAppsUsed(prev =>
      prev.includes(app) ? prev.filter(a => a !== app) : [...prev, app]
    );
  };

  const handleSave = () => {
    if (actualHoursUsed.length === 0) {
      toast({
        title: 'Horários obrigatórios',
        description: 'Marque pelo menos um horário de uso.',
        variant: 'destructive',
      });
      return;
    }

    if (!behaviorWithPhone || !behaviorWithoutPhone) {
      toast({
        title: 'Comportamentos obrigatórios',
        description: 'Preencha os comportamentos observados.',
        variant: 'destructive',
      });
      return;
    }

    addDailyLog({
      date,
      familyMemberId: member.id,
      actualHoursUsed,
      appsUsed,
      behaviorWithPhone,
      behaviorWithoutPhone,
      notes,
    });

    toast({
      title: 'Registro salvo!',
      description: `Observação diária de ${member.name} foi registrada.`,
    });

    navigate('/premium/weekly-reports');
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <Button
        variant="ghost"
        onClick={() => navigate('/premium/weekly-reports')}
        className="mb-6 hover:bg-primary/10"
        data-testid="button-back"
      >
        <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
        Voltar
      </Button>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="h-6 w-6 text-primary" aria-hidden="true" />
          <h1 className="text-3xl font-bold">Registro Diário</h1>
        </div>
        <p className="text-muted-foreground">
          Registre suas observações sobre {member.name}
        </p>
      </div>

      <Card className="p-6 mb-6">
        <div className="mb-4">
          <Label htmlFor="date">Data</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={today}
            data-testid="input-date"
          />
        </div>

        <div className="mb-6">
          <h3 className="font-bold mb-3">Horários em que usou o celular</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Marque os horários em que você observou {member.name} usando o celular
          </p>
          <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
            {HOURS.map(hour => {
              const isUsed = actualHoursUsed.includes(hour);
              return (
                <button
                  key={hour}
                  onClick={() => toggleHour(hour)}
                  className={`p-2 rounded text-sm transition-colors ${
                    isUsed
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                  data-testid={`hour-${hour}`}
                >
                  {hour}h
                </button>
              );
            })}
          </div>
        </div>

        {member.apps && member.apps.length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold mb-3">Apps que usou</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {member.apps.map(app => (
                <div key={app} className="flex items-center space-x-2">
                  <Checkbox
                    id={`app-${app}`}
                    checked={appsUsed.includes(app)}
                    onCheckedChange={() => toggleApp(app)}
                    data-testid={`checkbox-app-${app}`}
                  />
                  <Label htmlFor={`app-${app}`} className="text-sm cursor-pointer">
                    {app}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-4">
          <Label htmlFor="behaviorWithPhone">Comportamento COM celular</Label>
          <Textarea
            id="behaviorWithPhone"
            value={behaviorWithPhone}
            onChange={(e) => setBehaviorWithPhone(e.target.value)}
            placeholder="Ex: Irritado, ansioso, disperso..."
            rows={3}
            data-testid="textarea-behavior-with"
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="behaviorWithoutPhone">Comportamento SEM celular</Label>
          <Textarea
            id="behaviorWithoutPhone"
            value={behaviorWithoutPhone}
            onChange={(e) => setBehaviorWithoutPhone(e.target.value)}
            placeholder="Ex: Calmo, criativo, sociável..."
            rows={3}
            data-testid="textarea-behavior-without"
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="notes">Observações adicionais (opcional)</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Outras observações..."
            rows={3}
            data-testid="textarea-notes"
          />
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => navigate('/premium/weekly-reports')}
          data-testid="button-cancel"
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          className="bg-primary hover:bg-primary/90"
          data-testid="button-save"
        >
          <Save className="h-4 w-4 mr-2" aria-hidden="true" />
          Salvar Registro
        </Button>
      </div>
    </div>
  );
};

export default DailyLogForm;
