import { useState, useEffect } from 'react';
import { FocusSession, FocusTemplate } from '@/types';

interface FocusStorageData {
  focusSessions: FocusSession[];
  focusTemplates: FocusTemplate[];
  activeSessions: { [memberId: string]: string }; // member ID -> session ID
}

const STORAGE_KEY = 'focusModeData';

const defaultTemplates: FocusTemplate[] = [
  {
    id: 'study-short',
    name: 'Estudo Concentrado',
    description: 'Período focado para lição de casa e estudos',
    duration: 30,
    type: 'study',
    icon: '📚',
    color: 'blue',
    ageGroup: 'all',
    tips: [
      'Desligue todas as notificações',
      'Tenha um copo de água por perto',
      'Use uma mesa organizada',
      'Faça pausas de 5 minutos a cada 25 minutos'
    ]
  },
  {
    id: 'study-long',
    name: 'Estudo Prolongado',
    description: 'Sessão de estudo mais longa para projetos importantes',
    duration: 60,
    type: 'study',
    icon: '🎓',
    color: 'blue',
    ageGroup: 'teens',
    tips: [
      'Divida o tempo em blocos de 25 minutos',
      'Faça pausas entre os blocos',
      'Mantenha-se hidratado',
      'Use técnicas de respiração para relaxar'
    ]
  },
  {
    id: 'family-time',
    name: 'Tempo em Família',
    description: 'Momento para conversar e estar juntos sem dispositivos',
    duration: 45,
    type: 'family_time',
    icon: '👨‍👩‍👧‍👦',
    color: 'green',
    ageGroup: 'all',
    tips: [
      'Guarde todos os dispositivos em uma caixa',
      'Escolham uma atividade juntos',
      'Conversem sobre o dia de cada um',
      'Façam um jogo de tabuleiro ou cartas'
    ]
  },
  {
    id: 'outdoor-play',
    name: 'Brincadeira ao Ar Livre',
    description: 'Tempo para atividades físicas e contato com a natureza',
    duration: 60,
    type: 'outdoor',
    icon: '🌳',
    color: 'green',
    ageGroup: 'kids',
    tips: [
      'Explore o quintal ou parque próximo',
      'Observe os animais e plantas',
      'Faça atividades físicas simples',
      'Respire fundo e aproveite o ar puro'
    ]
  },
  {
    id: 'creative-time',
    name: 'Hora Criativa',
    description: 'Período para desenhar, pintar, escrever ou criar',
    duration: 40,
    type: 'creative',
    icon: '🎨',
    color: 'purple',
    ageGroup: 'all',
    tips: [
      'Separe materiais de arte ou escrita',
      'Deixe a criatividade fluir livremente',
      'Não se preocupe com perfeição',
      'Aproveite o processo de criar'
    ]
  },
  {
    id: 'rest-time',
    name: 'Momento de Descanso',
    description: 'Pausa para relaxar e recarregar as energias',
    duration: 20,
    type: 'rest',
    icon: '😌',
    color: 'indigo',
    ageGroup: 'all',
    tips: [
      'Encontre um lugar confortável',
      'Pratique respiração profunda',
      'Ouça música calma se desejar',
      'Deixe a mente descansar'
    ]
  }
];

const defaultData: FocusStorageData = {
  focusSessions: [],
  focusTemplates: defaultTemplates,
  activeSessions: {}
};

export const useFocusModeStorage = () => {
  const [data, setData] = useState<FocusStorageData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedData = JSON.parse(stored);
        setData({ 
          ...defaultData, 
          ...parsedData,
          focusTemplates: defaultTemplates // Always use fresh templates
        });
      }
    } catch (error) {
      console.error('Error loading focus mode data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (error) {
        console.error('Error saving focus mode data:', error);
      }
    }
  }, [data, isLoading]);

  // Session management functions
  const startFocusSession = (memberId: string, templateId: string): string => {
    const template = data.focusTemplates.find(t => t.id === templateId);
    if (!template) throw new Error('Template not found');

    const sessionId = Date.now().toString();
    const newSession: FocusSession = {
      id: sessionId,
      familyMemberId: memberId,
      startTime: new Date().toISOString(),
      plannedDuration: template.duration,
      focusType: template.type,
      completed: false,
      interrupted: false,
      productivity: 0
    };

    setData(prev => ({
      ...prev,
      focusSessions: [...prev.focusSessions, newSession],
      activeSessions: {
        ...prev.activeSessions,
        [memberId]: sessionId
      }
    }));

    return sessionId;
  };

  const endFocusSession = (
    sessionId: string, 
    completed: boolean = true, 
    productivity: number = 5,
    interruptionReason?: string
  ) => {
    const now = new Date().toISOString();
    const session = data.focusSessions.find(s => s.id === sessionId);
    if (!session) return;

    const startTime = new Date(session.startTime);
    const endTime = new Date(now);
    const actualDuration = Math.floor((endTime.getTime() - startTime.getTime()) / (1000 * 60));

    setData(prev => ({
      ...prev,
      focusSessions: prev.focusSessions.map(s =>
        s.id === sessionId
          ? {
              ...s,
              endTime: now,
              actualDuration,
              completed,
              interrupted: !completed,
              interruptionReason,
              productivity
            }
          : s
      ),
      activeSessions: Object.fromEntries(
        Object.entries(prev.activeSessions).filter(([_, sId]) => sId !== sessionId)
      )
    }));
  };

  const pauseFocusSession = (sessionId: string) => {
    // In a real app, this would pause the timer
    // For now, we'll just mark it as interrupted
    endFocusSession(sessionId, false, 3, 'Pausado pelo usuário');
  };

  // Query functions
  const getActiveSession = (memberId: string): FocusSession | null => {
    const activeSessionId = data.activeSessions[memberId];
    if (!activeSessionId) return null;
    
    return data.focusSessions.find(s => s.id === activeSessionId) || null;
  };

  const isInFocusMode = (memberId: string): boolean => {
    return !!data.activeSessions[memberId];
  };

  const getTodaysSessions = (memberId: string): FocusSession[] => {
    const today = new Date().toISOString().split('T')[0];
    return data.focusSessions.filter(session => {
      const sessionDate = session.startTime.split('T')[0];
      return session.familyMemberId === memberId && sessionDate === today;
    });
  };

  const getWeeklySessions = (memberId: string): FocusSession[] => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return data.focusSessions.filter(session => {
      const sessionDate = new Date(session.startTime);
      return session.familyMemberId === memberId && sessionDate >= oneWeekAgo;
    });
  };

  const getSessionStats = (memberId: string) => {
    const allSessions = data.focusSessions.filter(s => s.familyMemberId === memberId);
    const completedSessions = allSessions.filter(s => s.completed);
    const todaySessions = getTodaysSessions(memberId);
    const weeklySessions = getWeeklySessions(memberId);

    const totalFocusTime = completedSessions.reduce(
      (sum, session) => sum + (session.actualDuration || session.plannedDuration), 
      0
    );

    const averageProductivity = completedSessions.length > 0
      ? completedSessions.reduce((sum, session) => sum + session.productivity, 0) / completedSessions.length
      : 0;

    const todayFocusTime = todaySessions
      .filter(s => s.completed)
      .reduce((sum, session) => sum + (session.actualDuration || session.plannedDuration), 0);

    const weeklyFocusTime = weeklySessions
      .filter(s => s.completed)
      .reduce((sum, session) => sum + (session.actualDuration || session.plannedDuration), 0);

    // Calculate streak (consecutive days with at least one completed session)
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      const dayHadSession = allSessions.some(session => {
        const sessionDate = session.startTime.split('T')[0];
        return sessionDate === dateStr && session.completed;
      });

      if (dayHadSession) {
        streak++;
      } else if (i > 0) { // Don't break on today if no session yet
        break;
      }
    }

    return {
      totalSessions: allSessions.length,
      completedSessions: completedSessions.length,
      totalFocusTime,
      todayFocusTime,
      weeklyFocusTime,
      averageProductivity: Math.round(averageProductivity * 10) / 10,
      streak,
      completionRate: allSessions.length > 0 ? (completedSessions.length / allSessions.length) * 100 : 0
    };
  };

  const getTemplatesByAge = (ageGroup: FocusTemplate['ageGroup'] | 'all'): FocusTemplate[] => {
    return data.focusTemplates.filter(template => 
      template.ageGroup === ageGroup || template.ageGroup === 'all'
    );
  };

  const getMostUsedTemplates = (memberId: string, limit: number = 3): FocusTemplate[] => {
    const memberSessions = data.focusSessions.filter(s => s.familyMemberId === memberId);
    const templateUsage = memberSessions.reduce((acc, session) => {
      const template = data.focusTemplates.find(t => t.type === session.focusType);
      if (template) {
        acc[template.id] = (acc[template.id] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return data.focusTemplates
      .sort((a, b) => (templateUsage[b.id] || 0) - (templateUsage[a.id] || 0))
      .slice(0, limit);
  };

  return {
    focusSessions: data.focusSessions,
    focusTemplates: data.focusTemplates,
    activeSessions: data.activeSessions,
    isLoading,
    
    // Session management
    startFocusSession,
    endFocusSession,
    pauseFocusSession,
    
    // Query functions
    getActiveSession,
    isInFocusMode,
    getTodaysSessions,
    getWeeklySessions,
    getSessionStats,
    getTemplatesByAge,
    getMostUsedTemplates
  };
};