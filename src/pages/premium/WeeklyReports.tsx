import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, TrendingDown, TrendingUp, Award, Target, Clock, BarChart3, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useScreenTimeStorage } from '@/hooks/useScreenTimeStorage';
import { WeeklyReport, Achievement } from '@/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const WeeklyReports: React.FC = () => {
  const navigate = useNavigate();
  const { familyMembers, getWeeklyUsage } = useScreenTimeStorage();
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [selectedWeek, setSelectedWeek] = useState<string>('current');

  // Generate sample weekly report data
  const generateWeeklyReport = (memberId: string): WeeklyReport => {
    const weeklyUsage = getWeeklyUsage(memberId);
    const totalUsage = weeklyUsage.reduce((sum, day) => sum + day.usage, 0);
    const dailyAverage = totalUsage / 7;
    const member = familyMembers.find(m => m.id === memberId);
    const goalAchieved = dailyAverage <= (member?.dailyLimit || 120);

    const achievements: Achievement[] = [];
    
    if (goalAchieved) {
      achievements.push({
        id: '1',
        title: 'Meta Semanal Atingida!',
        description: 'Você manteve o tempo de tela dentro do limite durante toda a semana',
        icon: '🏆',
        earnedDate: new Date().toISOString(),
        type: 'goal'
      });
    }

    const consecutiveDaysUnderLimit = weeklyUsage.reduce((streak, day, index) => {
      if (day.usage <= (member?.dailyLimit || 120)) {
        return index === 0 ? 1 : streak + 1;
      }
      return 0;
    }, 0);

    if (consecutiveDaysUnderLimit >= 3) {
      achievements.push({
        id: '2',
        title: 'Sequência de Disciplina',
        description: `${consecutiveDaysUnderLimit} dias consecutivos dentro do limite`,
        icon: '🔥',
        earnedDate: new Date().toISOString(),
        type: 'streak'
      });
    }

    const improvementSuggestions = [];
    if (!goalAchieved) {
      improvementSuggestions.push('Considere estabelecer períodos específicos para uso de dispositivos');
      improvementSuggestions.push('Experimente atividades offline como leitura ou exercícios');
    }
    if (totalUsage > 0) {
      improvementSuggestions.push('Use o Modo Foco para criar períodos livres de tela');
    }

    return {
      id: Date.now().toString(),
      familyMemberId: memberId,
      weekStartDate: new Date().toISOString().split('T')[0],
      totalUsage,
      dailyAverage,
      goalAchieved,
      improvementSuggestions,
      topApps: [
        { name: 'YouTube', usage: Math.floor(totalUsage * 0.3), category: 'Entretenimento' },
        { name: 'Instagram', usage: Math.floor(totalUsage * 0.25), category: 'Social' },
        { name: 'TikTok', usage: Math.floor(totalUsage * 0.2), category: 'Entretenimento' },
        { name: 'WhatsApp', usage: Math.floor(totalUsage * 0.15), category: 'Comunicação' },
        { name: 'Outros', usage: Math.floor(totalUsage * 0.1), category: 'Diversos' }
      ].filter(app => app.usage > 0),
      achievements
    };
  };

  const currentReport = useMemo(() => {
    if (!selectedMemberId) return null;
    return generateWeeklyReport(selectedMemberId);
  }, [selectedMemberId, familyMembers]);

  const chartData = useMemo(() => {
    if (!selectedMemberId) return [];
    const weeklyUsage = getWeeklyUsage(selectedMemberId);
    const member = familyMembers.find(m => m.id === selectedMemberId);
    
    return weeklyUsage.map(day => ({
      day: new Date(day.date).toLocaleDateString('pt-BR', { weekday: 'short' }),
      usage: day.usage,
      limit: member?.dailyLimit || 120,
      date: day.date
    }));
  }, [selectedMemberId, familyMembers]);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getProgressColor = (achieved: boolean) => {
    return achieved ? 'bg-green-500' : 'bg-red-500';
  };

  if (familyMembers.length === 0) {
    return (
      <div className="animate-fade-in max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/premium')}
          className="mb-6 hover:bg-primary/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao Dashboard Premium
        </Button>

        <Card className="p-8 text-center">
          <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-4">Relatórios Semanais</h2>
          <p className="text-muted-foreground mb-6">
            Adicione membros da família para começar a gerar relatórios semanais detalhados.
          </p>
          <Button onClick={() => navigate('/premium/screen-time')}>
            Gerenciar Família
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-6xl mx-auto">
      <Button
        variant="ghost"
        onClick={() => navigate('/premium')}
        className="mb-6 hover:bg-primary/10"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar ao Dashboard Premium
      </Button>

      <div className="mb-8">
        <div className="flex items-center mb-4">
          <BarChart3 className="h-8 w-8 text-blue-600 mr-3" />
          <div>
            <h1 className="text-3xl font-bold">Relatórios Semanais</h1>
            <p className="text-muted-foreground">
              Análise detalhada do progresso da família
            </p>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
            <SelectTrigger className="w-64" data-testid="select-family-member">
              <SelectValue placeholder="Selecione um membro da família" />
            </SelectTrigger>
            <SelectContent>
              {familyMembers.map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  {member.name} ({member.age} anos)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedWeek} onValueChange={setSelectedWeek}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Semana Atual</SelectItem>
              <SelectItem value="last">Semana Passada</SelectItem>
              <SelectItem value="two_weeks">2 Semanas Atrás</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {currentReport && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tempo Total</p>
                  <p className="text-2xl font-bold">{formatTime(currentReport.totalUsage)}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Média Diária</p>
                  <p className="text-2xl font-bold">{formatTime(Math.round(currentReport.dailyAverage))}</p>
                </div>
                <Target className="h-8 w-8 text-green-600" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Meta</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">
                      {currentReport.goalAchieved ? 'Atingida' : 'Não atingida'}
                    </span>
                    {currentReport.goalAchieved ? (
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Conquistas</p>
                  <p className="text-2xl font-bold">{currentReport.achievements.length}</p>
                </div>
                <Award className="h-8 w-8 text-yellow-600" />
              </div>
            </Card>
          </div>

          {/* Usage Chart */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Uso Diário da Semana</h3>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis label={{ value: 'Minutos', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  labelFormatter={(label, payload) => {
                    const point = payload?.[0]?.payload;
                    return point ? new Date(point.date).toLocaleDateString('pt-BR') : label;
                  }}
                  formatter={(value, name) => [
                    `${value} min`,
                    name === 'usage' ? 'Tempo de Uso' : 'Limite Diário'
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="usage" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="limit" 
                  stroke="#ef4444" 
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Top Apps */}
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Apps Mais Utilizados</h3>
            <div className="space-y-4">
              {currentReport.topApps.map((app, index) => (
                <div key={app.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '📱'}</span>
                    <div>
                      <p className="font-medium">{app.name}</p>
                      <p className="text-sm text-muted-foreground">{app.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatTime(app.usage)}</p>
                    <p className="text-sm text-muted-foreground">
                      {Math.round((app.usage / currentReport.totalUsage) * 100)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Achievements */}
          {currentReport.achievements.length > 0 && (
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Conquistas da Semana</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentReport.achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border"
                  >
                    <span className="text-3xl">{achievement.icon}</span>
                    <div>
                      <p className="font-bold text-yellow-800">{achievement.title}</p>
                      <p className="text-sm text-yellow-700">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Improvement Suggestions */}
          {currentReport.improvementSuggestions.length > 0 && (
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Sugestões de Melhoria</h3>
              <div className="space-y-3">
                {currentReport.improvementSuggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="text-blue-600 mt-1">💡</span>
                    <p className="text-muted-foreground">{suggestion}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default WeeklyReports;