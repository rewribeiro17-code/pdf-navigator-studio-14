import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Bell, BellOff, AlertTriangle, CheckCircle, Info, Target, Clock, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useScreenTimeStorage } from '@/hooks/useScreenTimeStorage';
import { useSmartAlertsStorage } from '@/hooks/useSmartAlertsStorage';
import { SmartAlert } from '@/types';

const SmartAlerts: React.FC = () => {
  const navigate = useNavigate();
  const { familyMembers, getWeeklyUsage } = useScreenTimeStorage();
  const { 
    alerts, 
    alertSettings, 
    addAlert, 
    markAsRead, 
    markAllAsRead, 
    dismissAlert, 
    updateSettings, 
    getUnreadCount 
  } = useSmartAlertsStorage();

  // Generate smart alerts based on family data
  const generateSmartAlerts = () => {
    familyMembers.forEach(member => {
      const weeklyUsage = getWeeklyUsage(member.id);
      const todayUsage = weeklyUsage[weeklyUsage.length - 1]?.usage || 0;
      const yesterdayUsage = weeklyUsage[weeklyUsage.length - 2]?.usage || 0;

      // Daily limit warnings
      if (alertSettings.dailyLimitWarnings) {
        if (todayUsage >= member.dailyLimit * 0.8 && todayUsage < member.dailyLimit) {
          addAlert({
            familyMemberId: member.id,
            type: 'warning',
            title: `${member.name} está próximo do limite`,
            message: `Faltam apenas ${Math.round(member.dailyLimit - todayUsage)} minutos para atingir o limite diário.`,
            priority: 'medium',
            actionRequired: true
          });
        }

        if (todayUsage >= member.dailyLimit) {
          addAlert({
            familyMemberId: member.id,
            type: 'limit_reached',
            title: `${member.name} atingiu o limite diário`,
            message: `O limite de ${Math.round(member.dailyLimit)} minutos foi atingido. Hora de uma pausa!`,
            priority: 'high',
            actionRequired: true
          });
        }
      }

      // Goal achievements
      if (alertSettings.goalAchievements && todayUsage <= member.dailyLimit && yesterdayUsage > member.dailyLimit) {
        addAlert({
          familyMemberId: member.id,
          type: 'goal_achieved',
          title: `🎉 ${member.name} voltou aos trilhos!`,
          message: `Parabéns! Hoje o tempo de tela ficou dentro do limite estabelecido.`,
          priority: 'low'
        });
      }

      // Screen time reminders
      if (alertSettings.screenTimeReminders && todayUsage === 0) {
        const hour = new Date().getHours();
        if (hour >= 18) { // After 6 PM
          addAlert({
            familyMemberId: member.id,
            type: 'reminder',
            title: `Dia sem tela para ${member.name}! 🌟`,
            message: `Que dia incrível! Nenhum tempo de tela registrado hoje. Continue assim!`,
            priority: 'low'
          });
        }
      }

      // Improvement suggestions
      const weeklyAverage = weeklyUsage.reduce((sum, day) => sum + day.usage, 0) / 7;
      if (weeklyAverage > member.dailyLimit * 1.2) {
        addAlert({
          familyMemberId: member.id,
          type: 'suggestion',
          title: `Sugestão para ${member.name}`,
          message: `A média semanal está 20% acima do ideal. Que tal experimentar o Modo Foco para criar períodos livres de tela?`,
          priority: 'medium'
        });
      }
    });

    // Weekly reports reminder
    if (alertSettings.weeklyReports && new Date().getDay() === 0) { // Sunday
      addAlert({
        familyMemberId: '',
        type: 'reminder',
        title: 'Relatório Semanal Disponível',
        message: 'O novo relatório semanal da família está pronto! Veja o progresso de todos.',
        priority: 'low'
      });
    }
  };

  useEffect(() => {
    generateSmartAlerts();
    // Regenerate alerts every 5 minutes in a real app
    const interval = setInterval(generateSmartAlerts, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [familyMembers, alertSettings]);


  const getAlertIcon = (type: SmartAlert['type']) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'limit_reached':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'goal_achieved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'suggestion':
        return <Info className="h-5 w-5 text-blue-600" />;
      case 'reminder':
        return <Bell className="h-5 w-5 text-purple-600" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getPriorityColor = (priority: SmartAlert['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-l-blue-500 bg-blue-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const unreadCount = getUnreadCount();

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

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Bell className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold">Alertas Inteligentes</h1>
              <p className="text-muted-foreground">
                Notificações contextuais para toda a família
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-lg px-3 py-1">
              {unreadCount} novos
            </Badge>
          )}
        </div>

        {alerts.length > 0 && (
          <div className="flex gap-2 mb-6">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              Marcar Todos Como Lidos
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configurar Alertas
            </Button>
          </div>
        )}
      </div>

      {/* Alert Settings */}
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-bold mb-4">Configurações de Alertas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Avisos de Limite Diário</p>
              <p className="text-sm text-muted-foreground">Quando alguém se aproxima do limite</p>
            </div>
            <Switch
              checked={alertSettings.dailyLimitWarnings}
              onCheckedChange={(checked) => 
                updateSettings({ dailyLimitWarnings: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Conquistas de Metas</p>
              <p className="text-sm text-muted-foreground">Celebrar quando metas são atingidas</p>
            </div>
            <Switch
              checked={alertSettings.goalAchievements}
              onCheckedChange={(checked) => 
                updateSettings({ goalAchievements: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Relatórios Semanais</p>
              <p className="text-sm text-muted-foreground">Lembrete quando novo relatório estiver pronto</p>
            </div>
            <Switch
              checked={alertSettings.weeklyReports}
              onCheckedChange={(checked) => 
                updateSettings({ weeklyReports: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Lembretes de Tempo de Tela</p>
              <p className="text-sm text-muted-foreground">Celebrar dias sem uso excessivo</p>
            </div>
            <Switch
              checked={alertSettings.screenTimeReminders}
              onCheckedChange={(checked) => 
                updateSettings({ screenTimeReminders: checked })
              }
            />
          </div>
        </div>
      </Card>

      {/* Alerts List */}
      {alerts.length === 0 ? (
        <Card className="p-8 text-center">
          <BellOff className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Nenhum alerta no momento</h2>
          <p className="text-muted-foreground mb-6">
            Os alertas aparecerão aqui conforme a atividade da família.
          </p>
          <Button onClick={() => navigate('/premium/screen-time')}>
            Gerenciar Tempo de Tela
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => {
            const member = familyMembers.find(m => m.id === alert.familyMemberId);
            
            return (
              <Card
                key={alert.id}
                className={`p-4 border-l-4 ${getPriorityColor(alert.priority)} ${
                  alert.isRead ? 'opacity-75' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold">{alert.title}</h3>
                        {!alert.isRead && (
                          <Badge variant="secondary" className="text-xs">
                            Novo
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs capitalize">
                          {alert.priority}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-2">{alert.message}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>
                          {new Date(alert.createdAt).toLocaleString('pt-BR')}
                        </span>
                        {member && (
                          <span className="flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            {member.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    {!alert.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(alert.id)}
                      >
                        Marcar como Lida
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => dismissAlert(alert.id)}
                    >
                      Dispensar
                    </Button>
                  </div>
                </div>

                {alert.actionRequired && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => navigate('/premium/focus-mode')}>
                        Iniciar Modo Foco
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => navigate('/premium/family-goals')}>
                        Ver Metas
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SmartAlerts;