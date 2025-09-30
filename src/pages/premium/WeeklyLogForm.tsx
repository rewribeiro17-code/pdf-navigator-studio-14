import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save, CalendarRange } from 'lucide-react';
import { useScreenTimeStorage } from '@/hooks/useScreenTimeStorage';
import { useWeeklyLogs } from '@/hooks/useWeeklyLogs';
import { useToast } from '@/hooks/use-toast';

const WeeklyLogForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const memberId = searchParams.get('memberId');
  const { familyMembers } = useScreenTimeStorage();
  const { addWeeklyLog } = useWeeklyLogs();
  const { toast } = useToast();

  const member = familyMembers.find(m => m.id === memberId);

  // Get Monday of current week
  const getMonday = (d: Date) => {
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const getSunday = (d: Date) => {
    const monday = getMonday(new Date(d));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return sunday;
  };

  const monday = getMonday(new Date());
  const sunday = getSunday(new Date());

  const [weekStartDate, setWeekStartDate] = useState(monday.toISOString().split('T')[0]);
  const [weekEndDate, setWeekEndDate] = useState(sunday.toISOString().split('T')[0]);
  const [summary, setSummary] = useState('');
  const [topApps, setTopApps] = useState<string[]>([]);
  const [behaviorPatterns, setBehaviorPatterns] = useState('');
  const [progress, setProgress] = useState('');
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

  const toggleApp = (app: string) => {
    setTopApps(prev =>
      prev.includes(app) ? prev.filter(a => a !== app) : [...prev, app]
    );
  };

  const handleSave = () => {
    if (!summary || !behaviorPatterns || !progress) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha todos os campos obrigatórios.',
        variant: 'destructive',
      });
      return;
    }

    addWeeklyLog({
      weekStartDate,
      weekEndDate,
      familyMemberId: member.id,
      summary,
      topApps,
      behaviorPatterns,
      progress,
      notes,
    });

    toast({
      title: 'Registro salvo!',
      description: `Resumo semanal de ${member.name} foi registrado.`,
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
          <CalendarRange className="h-6 w-6 text-primary" aria-hidden="true" />
          <h1 className="text-3xl font-bold">Registro Semanal</h1>
        </div>
        <p className="text-muted-foreground">
          Faça um resumo da semana de {member.name}
        </p>
      </div>

      <Card className="p-6 mb-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <Label htmlFor="weekStartDate">Início da Semana</Label>
            <Input
              id="weekStartDate"
              type="date"
              value={weekStartDate}
              onChange={(e) => setWeekStartDate(e.target.value)}
              data-testid="input-week-start"
            />
          </div>
          <div>
            <Label htmlFor="weekEndDate">Fim da Semana</Label>
            <Input
              id="weekEndDate"
              type="date"
              value={weekEndDate}
              onChange={(e) => setWeekEndDate(e.target.value)}
              data-testid="input-week-end"
            />
          </div>
        </div>

        <div className="mb-4">
          <Label htmlFor="summary">Resumo da Semana</Label>
          <Textarea
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Descreva como foi a semana em geral..."
            rows={4}
            data-testid="textarea-summary"
          />
        </div>

        {member.apps && member.apps.length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold mb-3">Apps mais usados esta semana</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {member.apps.map(app => (
                <div key={app} className="flex items-center space-x-2">
                  <Checkbox
                    id={`app-${app}`}
                    checked={topApps.includes(app)}
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
          <Label htmlFor="behaviorPatterns">Padrões de Comportamento</Label>
          <Textarea
            id="behaviorPatterns"
            value={behaviorPatterns}
            onChange={(e) => setBehaviorPatterns(e.target.value)}
            placeholder="Quais padrões você observou no comportamento do(a) filho(a)?"
            rows={4}
            data-testid="textarea-patterns"
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="progress">Evolução e Progresso</Label>
          <Textarea
            id="progress"
            value={progress}
            onChange={(e) => setProgress(e.target.value)}
            placeholder="Como você avalia o progresso em relação às semanas anteriores?"
            rows={4}
            data-testid="textarea-progress"
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

export default WeeklyLogForm;
