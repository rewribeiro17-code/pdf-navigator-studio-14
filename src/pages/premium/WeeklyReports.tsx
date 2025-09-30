import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, TrendingDown, TrendingUp, Award, Target, Clock, BarChart3, Download, CalendarPlus, FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useScreenTimeStorage } from '@/hooks/useScreenTimeStorage';
import { useDailyLogs } from '@/hooks/useDailyLogs';
import { useWeeklyLogs } from '@/hooks/useWeeklyLogs';
import type { DayOfWeek } from '@/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const WeeklyReports: React.FC = () => {
  const navigate = useNavigate();
  const { familyMembers, getWeeklyUsage } = useScreenTimeStorage();
  const { getLogsByMember, getLogsByDateRange } = useDailyLogs();
  const { getLogsByMember: getWeeklyLogsByMember } = useWeeklyLogs();
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [selectedWeek, setSelectedWeek] = useState<string>('current');

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const selectedMember = useMemo(() => {
    return familyMembers.find(m => m.id === selectedMemberId);
  }, [selectedMemberId, familyMembers]);

  const dailyLogsForMember = useMemo(() => {
    if (!selectedMemberId) return [];
    return getLogsByMember(selectedMemberId);
  }, [selectedMemberId, getLogsByMember]);

  const weeklyLogsForMember = useMemo(() => {
    if (!selectedMemberId) return [];
    return getWeeklyLogsByMember(selectedMemberId);
  }, [selectedMemberId, getWeeklyLogsByMember]);

  const complianceAnalysis = useMemo(() => {
    if (!selectedMember || dailyLogsForMember.length === 0) {
      return null;
    }

    const allowedHours = selectedMember.allowedHours || {};
    let totalDays = 0;
    let compliantDays = 0;
    let violationDetails: string[] = [];

    dailyLogsForMember.forEach(log => {
      const logDate = new Date(log.date);
      const dayName = logDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as DayOfWeek;
      const allowed = allowedHours[dayName] || [];
      
      // Só analisar conformidade se houver horários configurados para este dia
      if (allowed.length === 0) {
        return;
      }

      totalDays++;

      const allWithinAllowed = log.actualHoursUsed.every(hour => allowed.includes(hour));
      
      if (allWithinAllowed) {
        compliantDays++;
      } else {
        const violations = log.actualHoursUsed.filter(hour => !allowed.includes(hour));
        if (violations.length > 0) {
          violationDetails.push(
            `${logDate.toLocaleDateString('pt-BR')}: Uso fora do horário permitido (${violations.join('h, ')}h)`
          );
        }
      }
    });

    const complianceRate = totalDays > 0 ? (compliantDays / totalDays) * 100 : 0;

    return {
      complianceRate,
      compliantDays,
      totalDays,
      violationDetails: violationDetails.slice(0, 5),
    };
  }, [selectedMember, dailyLogsForMember]);

  const appUsageAnalysis = useMemo(() => {
    if (!selectedMember || dailyLogsForMember.length === 0) {
      return null;
    }

    // Contar frequência de uso de apps (quantos dias cada app foi usado)
    const appUsageCount: Record<string, number> = {};

    dailyLogsForMember.forEach(log => {
      log.appsUsed.forEach(app => {
        appUsageCount[app] = (appUsageCount[app] || 0) + 1;
      });
    });

    // Retornar apenas frequência (sem comparação de limites)
    return Object.entries(appUsageCount)
      .map(([app, daysUsed]) => ({
        app,
        daysUsed,
      }))
      .sort((a, b) => b.daysUsed - a.daysUsed);
  }, [selectedMember, dailyLogsForMember]);

  const automaticInsights = useMemo(() => {
    const insights: Array<{ type: 'success' | 'warning' | 'info'; message: string }> = [];

    if (dailyLogsForMember.length === 0) {
      insights.push({
        type: 'info',
        message: 'Nenhum registro diário disponível. Comece a registrar as observações para gerar insights automáticos.',
      });
      return insights;
    }

    if (complianceAnalysis) {
      if (complianceAnalysis.complianceRate >= 80) {
        insights.push({
          type: 'success',
          message: `Excelente! ${complianceAnalysis.complianceRate.toFixed(0)}% de conformidade com os horários permitidos. Continue assim!`,
        });
      } else if (complianceAnalysis.complianceRate >= 50) {
        insights.push({
          type: 'warning',
          message: `${complianceAnalysis.complianceRate.toFixed(0)}% de conformidade. Considere revisar os horários ou reforçar as regras.`,
        });
      } else {
        insights.push({
          type: 'warning',
          message: `Baixa conformidade (${complianceAnalysis.complianceRate.toFixed(0)}%). É importante dialogar sobre os horários estabelecidos.`,
        });
      }
    }

    if (appUsageAnalysis && appUsageAnalysis.length > 0) {
      const mostUsed = appUsageAnalysis.slice(0, 3).map(a => a.app).join(', ');
      insights.push({
        type: 'info',
        message: `Apps mais usados: ${mostUsed}`,
      });
    }

    const recentLogs = dailyLogsForMember.slice(-7);
    const withPhoneBehaviors = recentLogs.map(l => l.behaviorWithPhone).filter(Boolean);
    const withoutPhoneBehaviors = recentLogs.map(l => l.behaviorWithoutPhone).filter(Boolean);
    
    if (withoutPhoneBehaviors.length > 0) {
      insights.push({
        type: 'info',
        message: `Padrões observados sem celular: verifique os registros para identificar atividades positivas.`,
      });
    }

    if (weeklyLogsForMember.length > 0) {
      const latestWeekly = weeklyLogsForMember[weeklyLogsForMember.length - 1];
      if (latestWeekly.progress) {
        insights.push({
          type: 'info',
          message: `Evolução semanal: ${latestWeekly.progress}`,
        });
      }
    }

    return insights;
  }, [dailyLogsForMember, weeklyLogsForMember, complianceAnalysis, appUsageAnalysis]);

  const comparisonChartData = useMemo(() => {
    if (!selectedMember || dailyLogsForMember.length === 0) {
      return [];
    }

    const last7Days = dailyLogsForMember.slice(-7);
    
    return last7Days.map(log => {
      const logDate = new Date(log.date);
      const dayName = logDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as DayOfWeek;
      const allowedHours = selectedMember.allowedHours?.[dayName] || [];
      
      return {
        date: logDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        fullDate: log.date,
        allowedCount: allowedHours.length,
        actualCount: log.actualHoursUsed.length,
        day: logDate.toLocaleDateString('pt-BR', { weekday: 'short' }),
      };
    });
  }, [selectedMember, dailyLogsForMember]);

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
  }, [selectedMemberId, familyMembers, getWeeklyUsage]);

  if (familyMembers.length === 0) {
    return (
      <div className="animate-fade-in max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/premium')}
          className="mb-6 hover:bg-primary/10"
          data-testid="button-back"
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
          <Button onClick={() => navigate('/premium/screen-time')} data-testid="button-manage-family">
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
        data-testid="button-back"
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
              Análise comparativa: Regras vs Realidade
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
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
            <SelectTrigger className="w-48" data-testid="select-week">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Semana Atual</SelectItem>
              <SelectItem value="last">Semana Passada</SelectItem>
              <SelectItem value="two_weeks">2 Semanas Atrás</SelectItem>
            </SelectContent>
          </Select>

          {selectedMemberId && (
            <>
              <Button
                onClick={() => navigate(`/premium/daily-log?memberId=${selectedMemberId}`)}
                variant="default"
                data-testid="button-register-day"
              >
                <CalendarPlus className="h-4 w-4 mr-2" />
                Registrar Dia
              </Button>
              
              <Button
                onClick={() => navigate(`/premium/weekly-log?memberId=${selectedMemberId}`)}
                variant="outline"
                data-testid="button-register-week"
              >
                <FileText className="h-4 w-4 mr-2" />
                Registrar Semana
              </Button>
            </>
          )}
        </div>
      </div>

      {selectedMember && (
        <div className="space-y-6">
          {/* Insights Automáticos */}
          {automaticInsights.length > 0 && (
            <Card className="p-6" data-testid="card-insights">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-blue-600" />
                Insights Automáticos
              </h3>
              <div className="space-y-3">
                {automaticInsights.map((insight, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 p-3 rounded-lg ${
                      insight.type === 'success'
                        ? 'bg-green-50 border border-green-200'
                        : insight.type === 'warning'
                        ? 'bg-yellow-50 border border-yellow-200'
                        : 'bg-blue-50 border border-blue-200'
                    }`}
                    data-testid={`insight-${insight.type}-${index}`}
                  >
                    {insight.type === 'success' && (
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    )}
                    {insight.type === 'warning' && (
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    )}
                    {insight.type === 'info' && (
                      <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                    )}
                    <p
                      className={`flex-1 ${
                        insight.type === 'success'
                          ? 'text-green-800'
                          : insight.type === 'warning'
                          ? 'text-yellow-800'
                          : 'text-blue-800'
                      }`}
                    >
                      {insight.message}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Análise de Conformidade */}
          {complianceAnalysis && (
            <Card className="p-6" data-testid="card-compliance">
              <h3 className="text-xl font-bold mb-4">Análise de Conformidade</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Conformidade com Horários Permitidos</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {complianceAnalysis.complianceRate.toFixed(0)}%
                    </span>
                  </div>
                  <Progress 
                    value={complianceAnalysis.complianceRate} 
                    className="h-3"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    {complianceAnalysis.compliantDays} de {complianceAnalysis.totalDays} dias em conformidade
                  </p>
                </div>

                {complianceAnalysis.violationDetails.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 text-sm">Violações Recentes:</h4>
                    <div className="space-y-1">
                      {complianceAnalysis.violationDetails.map((detail, idx) => (
                        <p key={idx} className="text-sm text-muted-foreground">
                          • {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Gráfico Comparativo: Horários Permitidos vs Reais */}
          {comparisonChartData.length > 0 && (
            <Card className="p-6" data-testid="card-comparison-chart">
              <h3 className="text-xl font-bold mb-4">
                Horários Permitidos vs Horários Reais de Uso
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={comparisonChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis label={{ value: 'Horas', angle: -90, position: 'insideLeft' }} />
                  <Tooltip
                    formatter={(value, name) => [
                      `${value} hora(s)`,
                      name === 'allowedCount' ? 'Permitido' : 'Usado'
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="allowedCount" fill="#22c55e" name="Permitido" />
                  <Bar dataKey="actualCount" fill="#3b82f6" name="Usado" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          )}

          {/* Apps: Frequência de Uso */}
          {appUsageAnalysis && appUsageAnalysis.length > 0 && (
            <Card className="p-6" data-testid="card-app-usage">
              <h3 className="text-xl font-bold mb-4">Apps Mais Usados</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Frequência de uso observada pelos pais
              </p>
              <div className="space-y-3">
                {appUsageAnalysis.map((app) => (
                  <div key={app.app} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">{app.app}</span>
                    <Badge variant="secondary">
                      {app.daysUsed} {app.daysUsed === 1 ? 'dia' : 'dias'}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Uso Diário da Semana (Gráfico Original) */}
          <Card className="p-6" data-testid="card-usage-chart">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Tempo de Uso Diário</h3>
              <Button variant="outline" size="sm" data-testid="button-export">
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
                  name="Uso"
                />
                <Line 
                  type="monotone" 
                  dataKey="limit" 
                  stroke="#ef4444" 
                  strokeDasharray="5 5"
                  dot={false}
                  name="Limite"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Evolução - Registros Semanais */}
          {weeklyLogsForMember.length > 0 && (
            <Card className="p-6" data-testid="card-evolution">
              <h3 className="text-xl font-bold mb-4">Evolução do Comportamento</h3>
              <div className="space-y-4">
                {weeklyLogsForMember.slice(-4).reverse().map((log, index) => (
                  <div
                    key={log.id}
                    className="border-l-4 border-blue-500 pl-4 py-3 bg-gradient-to-r from-blue-50 to-transparent rounded"
                    data-testid={`weekly-log-${index}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-blue-700">
                        Semana de {new Date(log.weekStartDate).toLocaleDateString('pt-BR')}
                      </span>
                      <Badge variant="outline">
                        {new Date(log.weekStartDate).toLocaleDateString('pt-BR', { month: 'short' })}
                      </Badge>
                    </div>
                    
                    {log.summary && (
                      <div className="mb-2">
                        <p className="text-sm font-medium text-gray-700">Resumo:</p>
                        <p className="text-sm text-gray-600">{log.summary}</p>
                      </div>
                    )}
                    
                    {log.behaviorPatterns && (
                      <div className="mb-2">
                        <p className="text-sm font-medium text-gray-700">Padrões de Comportamento:</p>
                        <p className="text-sm text-gray-600">{log.behaviorPatterns}</p>
                      </div>
                    )}
                    
                    {log.progress && (
                      <div className="mb-2">
                        <p className="text-sm font-medium text-gray-700">Progresso:</p>
                        <p className="text-sm text-green-600 font-medium">{log.progress}</p>
                      </div>
                    )}
                    
                    {log.topApps && log.topApps.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Apps mais usados:</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {log.topApps.map((app, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {app}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Observações Diárias Recentes */}
          {dailyLogsForMember.length > 0 && (
            <Card className="p-6" data-testid="card-daily-observations">
              <h3 className="text-xl font-bold mb-4">Observações Diárias Recentes</h3>
              <div className="space-y-3">
                {dailyLogsForMember.slice(-5).reverse().map((log, index) => (
                  <div
                    key={log.id}
                    className="p-4 bg-gray-50 rounded-lg border"
                    data-testid={`daily-log-${index}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">
                        {new Date(log.date).toLocaleDateString('pt-BR', { 
                          weekday: 'long', 
                          day: '2-digit', 
                          month: 'long' 
                        })}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-gray-700 mb-1">Com celular:</p>
                        <p className="text-gray-600">{log.behaviorWithPhone || 'Não registrado'}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700 mb-1">Sem celular:</p>
                        <p className="text-gray-600">{log.behaviorWithoutPhone || 'Não registrado'}</p>
                      </div>
                    </div>
                    
                    {log.appsUsed.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">
                          Apps: {log.appsUsed.join(', ')}
                        </p>
                      </div>
                    )}
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
