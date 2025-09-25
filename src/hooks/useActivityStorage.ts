import { useState, useEffect } from 'react';
import { Activity, WeeklyPlan, FamilyMember } from '@/types';

interface StoredActivity extends Activity {
  createdAt: string;
  memberId: string;
}

interface ActivityStorage {
  activities: StoredActivity[];
  weeklyPlans: WeeklyPlan[];
}

const STORAGE_KEY = 'activity-storage';

const useActivityStorage = () => {
  const [storage, setStorage] = useState<ActivityStorage>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : { activities: [], weeklyPlans: [] };
  });

  // Save to localStorage whenever storage changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
  }, [storage]);

  // Get default activities suggestions based on age
  const getDefaultActivities = (age: number): Omit<Activity, 'id'>[] => {
    const baseActivities = [
      { title: 'Leitura', description: 'Ler um livro interessante', duration: 30, category: 'educational' as const, icon: '📚' },
      { title: 'Desenho/Arte', description: 'Criar uma obra de arte', duration: 45, category: 'creative' as const, icon: '🎨' },
      { title: 'Brincar ao ar livre', description: 'Atividade física no quintal ou parque', duration: 60, category: 'physical' as const, icon: '🌳' },
      { title: 'Tempo em família', description: 'Atividade especial com a família', duration: 120, category: 'family' as const, icon: '👨‍👩‍👧‍👦' },
      { title: 'Jogos de tabuleiro', description: 'Jogar um jogo educativo', duration: 45, category: 'social' as const, icon: '🎲' },
    ];

    if (age >= 5 && age <= 8) {
      return [
        ...baseActivities,
        { title: 'Construir com blocos', description: 'Montar castelos e cidades', duration: 40, category: 'creative' as const, icon: '🧱' },
        { title: 'Bicicleta', description: 'Pedalar no quintal ou parque', duration: 30, category: 'physical' as const, icon: '🚴' },
      ].map(activity => ({ ...activity, ageRange: [5, 8] as [number, number] }));
    } else if (age >= 9 && age <= 12) {
      return [
        ...baseActivities,
        { title: 'Experimentos científicos', description: 'Fazer experimentos seguros em casa', duration: 60, category: 'educational' as const, icon: '🧪' },
        { title: 'Esporte', description: 'Futebol, basquete ou outro esporte', duration: 90, category: 'physical' as const, icon: '⚽' },
        { title: 'Culinária', description: 'Cozinhar algo gostoso', duration: 60, category: 'creative' as const, icon: '🍳' },
      ].map(activity => ({ ...activity, ageRange: [9, 12] as [number, number] }));
    } else {
      return [
        ...baseActivities,
        { title: 'Música/Instrumento', description: 'Tocar ou aprender um instrumento', duration: 45, category: 'creative' as const, icon: '🎵' },
        { title: 'Teatro/Drama', description: 'Encenar peças ou histórias', duration: 60, category: 'creative' as const, icon: '🎭' },
        { title: 'Projeto pessoal', description: 'Trabalhar em um hobby ou projeto', duration: 90, category: 'educational' as const, icon: '🔨' },
      ].map(activity => ({ ...activity, ageRange: [13, 18] as [number, number] }));
    }
  };

  // Add a new activity
  const addActivity = (memberId: string, activity: Omit<Activity, 'id'>) => {
    const newActivity: StoredActivity = {
      ...activity,
      id: Date.now().toString(),
      memberId,
      createdAt: new Date().toISOString(),
    };

    setStorage(prev => ({
      ...prev,
      activities: [...prev.activities, newActivity]
    }));

    return newActivity.id;
  };

  // Get activities for a specific member
  const getMemberActivities = (memberId: string): StoredActivity[] => {
    return storage.activities.filter(activity => activity.memberId === memberId);
  };

  // Get weekly plan for a member
  const getWeeklyPlan = (memberId: string): WeeklyPlan | null => {
    return storage.weeklyPlans.find(plan => plan.memberId === memberId) || null;
  };

  // Create or update weekly plan
  const createWeeklyPlan = (memberId: string, activities: { day: string; activityId: string }[]) => {
    const memberActivities = getMemberActivities(memberId);
    
    const planActivities = activities.map(({ day, activityId }) => {
      const activity = memberActivities.find(a => a.id === activityId);
      if (!activity) throw new Error(`Activity ${activityId} not found`);
      
      return {
        day,
        activity,
        completed: false
      };
    });

    const newPlan: WeeklyPlan = {
      memberId,
      activities: planActivities
    };

    setStorage(prev => ({
      ...prev,
      weeklyPlans: prev.weeklyPlans.filter(p => p.memberId !== memberId).concat(newPlan)
    }));
  };

  // Mark activity as completed in weekly plan
  const toggleActivityCompletion = (memberId: string, day: string, activityId: string) => {
    setStorage(prev => ({
      ...prev,
      weeklyPlans: prev.weeklyPlans.map(plan => {
        if (plan.memberId !== memberId) return plan;
        
        return {
          ...plan,
          activities: plan.activities.map(planActivity => {
            if (planActivity.day === day && planActivity.activity.id === activityId) {
              return { ...planActivity, completed: !planActivity.completed };
            }
            return planActivity;
          })
        };
      })
    }));
  };

  // Remove activity
  const removeActivity = (activityId: string) => {
    setStorage(prev => ({
      ...prev,
      activities: prev.activities.filter(a => a.id !== activityId),
      weeklyPlans: prev.weeklyPlans.map(plan => ({
        ...plan,
        activities: plan.activities.filter(pa => pa.activity.id !== activityId)
      }))
    }));
  };

  // Update activity
  const updateActivity = (activityId: string, updates: Partial<Omit<Activity, 'id'>>) => {
    setStorage(prev => ({
      ...prev,
      activities: prev.activities.map(activity => 
        activity.id === activityId ? { ...activity, ...updates } : activity
      ),
      weeklyPlans: prev.weeklyPlans.map(plan => ({
        ...plan,
        activities: plan.activities.map(planActivity => 
          planActivity.activity.id === activityId 
            ? { ...planActivity, activity: { ...planActivity.activity, ...updates } }
            : planActivity
        )
      }))
    }));
  };

  // Get completion stats for a member
  const getCompletionStats = (memberId: string) => {
    const plan = getWeeklyPlan(memberId);
    if (!plan) return { completed: 0, total: 0, percentage: 0 };
    
    const completed = plan.activities.filter(a => a.completed).length;
    const total = plan.activities.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { completed, total, percentage };
  };

  // Get total offline time for completed activities
  const getOfflineTime = (memberId: string) => {
    const plan = getWeeklyPlan(memberId);
    if (!plan) return 0;
    
    return plan.activities
      .filter(a => a.completed)
      .reduce((total, a) => total + a.activity.duration, 0);
  };

  return {
    activities: storage.activities,
    weeklyPlans: storage.weeklyPlans,
    addActivity,
    getMemberActivities,
    getWeeklyPlan,
    createWeeklyPlan,
    toggleActivityCompletion,
    removeActivity,
    updateActivity,
    getCompletionStats,
    getOfflineTime,
    getDefaultActivities,
  };
};

export default useActivityStorage;