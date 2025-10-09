import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Play, Pause, Square, Clock, Target, Brain, TrendingUp, Award, Lightbulb, Bell, BellOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useScreenTimeStorage } from '@/hooks/useScreenTimeStorage';
import { useFocusModeStorage } from '@/hooks/useFocusModeStorage';
import { FocusTemplate, FocusSession } from '@/types';

const FocusMode: React.FC = () => {
  const navigate = useNavigate();
  const { familyMembers } = useScreenTimeStorage();
  const { 
    focusTemplates,
    startFocusSession,
    endFocusSession,
    getActiveSession,
    isInFocusMode,
    getSessionStats,
    getTemplatesByAge,
    getMostUsedTemplates
  } = useFocusModeStorage();

  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<FocusTemplate | null>(null);
  const [activeSession, setActiveSession] = useState<FocusSession | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [sessionProductivity, setSessionProductivity] = useState<number>(5);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  // Request notification permission on component mount
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
      
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          setNotificationPermission(permission);
        });
      }
    }
  }, []);

  // Function to play notification sound
  const playNotificationSound = () => {
    try {
      // Create a simple beep using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800; // 800Hz frequency
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.error('Error playing notification sound:', error);
    }
  };

  // Function to send browser notification
  const sendNotification = () => {
    if (!selectedMember) return;
    
    // Play sound
    playNotificationSound();
    
    // Vibrate on mobile devices
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
    
    // Show browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification('⏰ Tempo Concluído!', {
        body: `${selectedMember.name} terminou a tarefa no Modo Foco!`,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'focus-mode-complete',
        requireInteraction: true
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }
  };

  // Clear active session when member changes
  useEffect(() => {
    setActiveSession(null);
    setTimeRemaining(0);
    setIsPaused(false);
  }, [selectedMemberId]);

  // Update active session timer
  useEffect(() => {
    if (activeSession) {
      const startTime = new Date(activeSession.startTime);
      const plannedEnd = new Date(startTime.getTime() + activeSession.plannedDuration * 60 * 1000);
      const now = new Date();
      const remaining = Math.max(0, Math.floor((plannedEnd.getTime() - now.getTime()) / 1000));
      setTimeRemaining(remaining);
    }
  }, [activeSession]);

  // Timer countdown
  useEffect(() => {
    if (activeSession && timeRemaining > 0 && !isPaused) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Session completed - send notification
            sendNotification();
            setShowCompletionDialog(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [activeSession, timeRemaining, isPaused]);

  const handleStartSession = (templateId: string) => {
    if (!selectedMemberId) return;
    
    try {
      const sessionId = startFocusSession(selectedMemberId, templateId);
      const session = getActiveSession(selectedMemberId);
      setActiveSession(session);
      
      const template = focusTemplates.find(t => t.id === templateId);
      if (template) {
        setTimeRemaining(template.duration * 60);
      }
    } catch (error) {
      console.error('Error starting focus session:', error);
    }
  };

  const handleEndSession = (completed: boolean = true) => {
    if (!activeSession) return;
    
    endFocusSession(
      activeSession.id, 
      completed, 
      sessionProductivity,
      completed ? undefined : 'Interrompido pelo usuário'
    );
    
    setActiveSession(null);
    setTimeRemaining(0);
    setIsPaused(false);
    setShowCompletionDialog(false);
  };

  const handlePauseSession = () => {
    setIsPaused(!isPaused);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = (): number => {
    if (!activeSession) return 0;
    const totalSeconds = activeSession.plannedDuration * 60;
    const elapsedSeconds = totalSeconds - timeRemaining;
    return Math.min(100, (elapsedSeconds / totalSeconds) * 100);
  };

  const getTemplateColor = (type: FocusTemplate['type']): string => {
    switch (type) {
      case 'study': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'family_time': return 'bg-green-100 text-green-800 border-green-200';
      case 'outdoor': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'creative': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'rest': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAgeGroupLabel = (ageGroup: FocusTemplate['ageGroup']): string => {
    switch (ageGroup) {
      case 'kids': return 'Crianças';
      case 'teens': return 'Adolescentes';
      case 'all': return 'Todas as idades';
      default: return 'Todas as idades';
    }
  };

  const selectedMember = familyMembers.find(m => m.id === selectedMemberId);
  const memberStats = selectedMemberId ? getSessionStats(selectedMemberId) : null;
  const availableTemplates = selectedMember 
    ? getTemplatesByAge(selectedMember.age <= 12 ? 'kids' : 'teens')
    : [];
  const mostUsedTemplates = selectedMemberId ? getMostUsedTemplates(selectedMemberId) : [];

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
          <Brain className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-4">Modo Foco</h2>
          <p className="text-muted-foreground mb-6">
            Adicione membros da família para começar a usar o Modo Foco.
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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Brain className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold">Modo Foco</h1>
              <p className="text-muted-foreground">
                Sessões focadas para toda a família
              </p>
            </div>
          </div>
          
          {notificationPermission === 'granted' ? (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Bell className="h-3 w-3 mr-1" />
              Notificações ativas
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              <BellOff className="h-3 w-3 mr-1" />
              Notificações desativadas
            </Badge>
          )}
        </div>

        <div className="mb-6">
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
        </div>
      </div>

      {selectedMemberId && (
        <div className="space-y-6">
          {/* Active Session */}
          {activeSession ? (
            <Card className="p-8 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Sessão de Foco Ativa</h2>
              </div>

              <div className="max-w-md mx-auto">
                <div className="text-center mb-6">
                  <div className="text-6xl font-mono font-bold text-purple-600 mb-2">
                    {formatTime(timeRemaining)}
                  </div>
                  <Progress value={getProgressPercentage()} className="h-4" />
                </div>

                <div className="flex gap-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={handlePauseSession}
                    className="flex-1"
                    data-testid="button-pause-session"
                  >
                    {isPaused ? (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Retomar
                      </>
                    ) : (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Pausar
                      </>
                    )}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleEndSession(false)}
                    className="flex-1"
                    data-testid="button-end-session"
                  >
                    <Square className="h-4 w-4 mr-2" />
                    Terminar
                  </Button>
                </div>
              </div>

              {/* Focus Tips */}
              <div className="mt-8 p-4 bg-white/50 rounded-lg">
                <h3 className="font-bold mb-3 flex items-center">
                  <Lightbulb className="h-4 w-4 mr-2 text-yellow-600" />
                  Dicas para essa sessão:
                </h3>
                {selectedTemplate && (
                  <ul className="space-y-1 text-sm">
                    {selectedTemplate.tips.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-purple-600 mr-2">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Card>
          ) : (
            /* Template Selection */
            <div className="space-y-6">
              {/* Quick Start - Most Used Templates */}
              {mostUsedTemplates.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Início Rápido</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {mostUsedTemplates.map(template => (
                      <Card key={template.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="text-center mb-3">
                          <span className="text-3xl mb-2 block">{template.icon}</span>
                          <h3 className="font-bold">{template.name}</h3>
                          <p className="text-sm text-muted-foreground">{template.duration} min</p>
                        </div>
                        <Button 
                          className="w-full" 
                          onClick={() => {
                            setSelectedTemplate(template);
                            handleStartSession(template.id);
                          }}
                          data-testid={`button-start-quick-${template.id}`}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Iniciar
                        </Button>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* All Templates */}
              <div>
                <h2 className="text-xl font-bold mb-4">Todas as Opções</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableTemplates.map(template => (
                    <Card key={template.id} className={`p-6 border-2 ${getTemplateColor(template.type)} hover:shadow-lg transition-all cursor-pointer`}>
                      <div className="text-center mb-4">
                        <span className="text-4xl mb-3 block">{template.icon}</span>
                        <h3 className="font-bold text-lg mb-1">{template.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                        
                        <div className="flex justify-center gap-2 mb-4">
                          <Badge variant="outline">
                            <Clock className="h-3 w-3 mr-1" />
                            {template.duration} min
                          </Badge>
                          <Badge variant="outline">
                            {getAgeGroupLabel(template.ageGroup)}
                          </Badge>
                        </div>
                      </div>

                      <Button 
                        className="w-full mb-3" 
                        onClick={() => {
                          setSelectedTemplate(template);
                          handleStartSession(template.id);
                        }}
                        data-testid={`button-start-template-${template.id}`}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Iniciar Sessão
                      </Button>

                      <div className="text-xs">
                        <p className="font-medium mb-1">Dicas para essa sessão:</p>
                        <ul className="space-y-1 text-muted-foreground">
                          {template.tips.slice(0, 2).map((tip, index) => (
                            <li key={index} className="flex items-start">
                              <span className="mr-1">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Statistics */}
          {memberStats && (
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Estatísticas de {selectedMember?.name}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{memberStats.totalSessions}</div>
                  <div className="text-sm text-muted-foreground">Sessões Totais</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{Math.round(memberStats.completionRate)}%</div>
                  <div className="text-sm text-muted-foreground">Taxa de Conclusão</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{Math.floor(memberStats.totalFocusTime / 60)}h</div>
                  <div className="text-sm text-muted-foreground">Tempo Total de Foco</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{memberStats.streak}</div>
                  <div className="text-sm text-muted-foreground">Dias Consecutivos</div>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Completion Dialog */}
      <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">🎉 Sessão Concluída!</DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4">
            <p>Parabéns! Você completou sua sessão de foco com sucesso.</p>
            
            <div>
              <label className="text-sm font-medium">Como foi sua produtividade? (1-5)</label>
              <div className="flex justify-center gap-2 mt-2">
                {[1, 2, 3, 4, 5].map(rating => (
                  <Button
                    key={rating}
                    variant={sessionProductivity === rating ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSessionProductivity(rating)}
                  >
                    {rating}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                onClick={() => handleEndSession(true)}
                className="flex-1"
              >
                <Award className="h-4 w-4 mr-2" />
                Finalizar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FocusMode;