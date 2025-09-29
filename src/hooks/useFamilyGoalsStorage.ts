import { useState, useEffect } from 'react';
import { FamilyGoal, FamilyPoints, Badge, GoalReward } from '@/types';

interface GoalsStorageData {
  familyGoals: FamilyGoal[];
  familyPoints: FamilyPoints[];
  availableRewards: GoalReward[];
}

const STORAGE_KEY = 'familyGoalsData';

const defaultRewards: GoalReward[] = [
  {
    id: 'reward-1',
    title: 'Escolher o Filme da Noite',
    description: 'Direito de escolher o que a família vai assistir',
    icon: '🎬',
    pointsRequired: 50,
    type: 'privilege'
  },
  {
    id: 'reward-2',
    title: 'Atividade Especial',
    description: 'Uma atividade escolhida pela criança no final de semana',
    icon: '🎨',
    pointsRequired: 100,
    type: 'activity'
  },
  {
    id: 'reward-3',
    title: 'Badge Digital Master',
    description: 'Conquista por equilibrar bem o tempo digital',
    icon: '🏆',
    pointsRequired: 200,
    type: 'badge'
  },
  {
    id: 'reward-4',
    title: 'Mesada Extra',
    description: 'R$ 10 extras na mesada',
    icon: '💰',
    pointsRequired: 300,
    type: 'privilege'
  }
];

const defaultBadges: Badge[] = [
  {
    id: 'badge-beginner',
    title: 'Primeiro Passo',
    description: 'Completou sua primeira meta',
    icon: '🌟',
    color: 'green',
    earnedDate: '',
    rarity: 'common'
  },
  {
    id: 'badge-streak',
    title: 'Consistência',
    description: '7 dias seguidos dentro do limite',
    icon: '🔥',
    color: 'orange',
    earnedDate: '',
    rarity: 'rare'
  },
  {
    id: 'badge-improvement',
    title: 'Melhoria',
    description: 'Reduziu o tempo de tela em 25%',
    icon: '📈',
    color: 'blue',
    earnedDate: '',
    rarity: 'rare'
  },
  {
    id: 'badge-family',
    title: 'Espírito de Equipe',
    description: 'Toda a família atingiu as metas na mesma semana',
    icon: '👨‍👩‍👧‍👦',
    color: 'purple',
    earnedDate: '',
    rarity: 'epic'
  },
  {
    id: 'badge-master',
    title: 'Digital Master',
    description: 'Manteve equilíbrio digital por 30 dias',
    icon: '👑',
    color: 'gold',
    earnedDate: '',
    rarity: 'legendary'
  }
];

const defaultData: GoalsStorageData = {
  familyGoals: [],
  familyPoints: [],
  availableRewards: defaultRewards
};

export const useFamilyGoalsStorage = () => {
  const [data, setData] = useState<GoalsStorageData>(defaultData);
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
          availableRewards: defaultRewards // Always use fresh rewards
        });
      }
    } catch (error) {
      console.error('Error loading family goals data:', error);
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
        console.error('Error saving family goals data:', error);
      }
    }
  }, [data, isLoading]);

  // Goal management functions
  const createFamilyGoal = (goal: Omit<FamilyGoal, 'id' | 'currentProgress' | 'isActive'>) => {
    const newGoal: FamilyGoal = {
      ...goal,
      id: Date.now().toString(),
      currentProgress: 0,
      isActive: true
    };

    setData(prev => ({
      ...prev,
      familyGoals: [...prev.familyGoals, newGoal]
    }));

    return newGoal.id;
  };

  const updateGoalProgress = (goalId: string, progress: number) => {
    setData(prev => ({
      ...prev,
      familyGoals: prev.familyGoals.map(goal =>
        goal.id === goalId 
          ? { ...goal, currentProgress: Math.min(progress, goal.targetValue) }
          : goal
      )
    }));
  };

  const completeGoal = (goalId: string) => {
    const goal = data.familyGoals.find(g => g.id === goalId);
    if (!goal) return;

    // Award points to participants
    goal.participants.forEach(memberId => {
      awardPoints(memberId, getGoalPoints(goal.difficulty));
    });

    setData(prev => ({
      ...prev,
      familyGoals: prev.familyGoals.map(g =>
        g.id === goalId 
          ? { ...g, isActive: false, currentProgress: g.targetValue }
          : g
      )
    }));
  };

  const getGoalPoints = (difficulty: FamilyGoal['difficulty']): number => {
    switch (difficulty) {
      case 'easy': return 10;
      case 'medium': return 25;
      case 'hard': return 50;
      default: return 10;
    }
  };

  // Points management
  const initializeMemberPoints = (memberId: string) => {
    const existingPoints = data.familyPoints.find(p => p.memberId === memberId);
    if (existingPoints) return;

    const newPoints: FamilyPoints = {
      memberId,
      totalPoints: 0,
      earnedToday: 0,
      earnedThisWeek: 0,
      badges: [],
      streak: 0
    };

    setData(prev => ({
      ...prev,
      familyPoints: [...prev.familyPoints, newPoints]
    }));
  };

  const awardPoints = (memberId: string, points: number) => {
    setData(prev => {
      const updatedPoints = prev.familyPoints.map(memberPoints => {
        if (memberPoints.memberId === memberId) {
          const newTotal = memberPoints.totalPoints + points;
          
          // Check for badge achievements
          const newBadges = [...memberPoints.badges];
          
          // Award first achievement badge
          if (newTotal >= 10 && !memberPoints.badges.find(b => b.id === 'badge-beginner')) {
            newBadges.push({
              ...defaultBadges.find(b => b.id === 'badge-beginner')!,
              earnedDate: new Date().toISOString()
            });
          }

          return {
            ...memberPoints,
            totalPoints: newTotal,
            earnedToday: memberPoints.earnedToday + points,
            earnedThisWeek: memberPoints.earnedThisWeek + points,
            badges: newBadges
          };
        }
        return memberPoints;
      });

      // If member doesn't exist, create new entry
      if (!updatedPoints.find(p => p.memberId === memberId)) {
        const newMemberPoints: FamilyPoints = {
          memberId,
          totalPoints: points,
          earnedToday: points,
          earnedThisWeek: points,
          badges: points >= 10 ? [{
            ...defaultBadges.find(b => b.id === 'badge-beginner')!,
            earnedDate: new Date().toISOString()
          }] : [],
          streak: 0
        };
        updatedPoints.push(newMemberPoints);
      }

      return {
        ...prev,
        familyPoints: updatedPoints
      };
    });
  };

  const awardBadge = (memberId: string, badgeId: string) => {
    const badge = defaultBadges.find(b => b.id === badgeId);
    if (!badge) return;

    setData(prev => ({
      ...prev,
      familyPoints: prev.familyPoints.map(points =>
        points.memberId === memberId
          ? {
              ...points,
              badges: [
                ...points.badges.filter(b => b.id !== badgeId),
                { ...badge, earnedDate: new Date().toISOString() }
              ]
            }
          : points
      )
    }));
  };

  const redeemReward = (memberId: string, rewardId: string) => {
    const reward = data.availableRewards.find(r => r.id === rewardId);
    const memberPoints = data.familyPoints.find(p => p.memberId === memberId);
    
    if (!reward || !memberPoints || memberPoints.totalPoints < reward.pointsRequired) {
      return false;
    }

    setData(prev => ({
      ...prev,
      familyPoints: prev.familyPoints.map(points =>
        points.memberId === memberId
          ? { ...points, totalPoints: points.totalPoints - reward.pointsRequired }
          : points
      )
    }));

    return true;
  };

  // Stats and helpers
  const getMemberPoints = (memberId: string): FamilyPoints | null => {
    return data.familyPoints.find(p => p.memberId === memberId) || null;
  };

  const getActiveGoals = (): FamilyGoal[] => {
    return data.familyGoals.filter(goal => goal.isActive);
  };

  const getCompletedGoals = (): FamilyGoal[] => {
    return data.familyGoals.filter(goal => !goal.isActive);
  };

  const getFamilyLeaderboard = () => {
    return data.familyPoints
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .slice(0, 10);
  };

  const resetWeeklyStats = () => {
    setData(prev => ({
      ...prev,
      familyPoints: prev.familyPoints.map(points => ({
        ...points,
        earnedThisWeek: 0
      }))
    }));
  };

  const resetDailyStats = () => {
    setData(prev => ({
      ...prev,
      familyPoints: prev.familyPoints.map(points => ({
        ...points,
        earnedToday: 0
      }))
    }));
  };

  return {
    familyGoals: data.familyGoals,
    familyPoints: data.familyPoints,
    availableRewards: data.availableRewards,
    isLoading,
    
    // Goal functions
    createFamilyGoal,
    updateGoalProgress,
    completeGoal,
    getActiveGoals,
    getCompletedGoals,
    
    // Points functions
    initializeMemberPoints,
    awardPoints,
    awardBadge,
    redeemReward,
    getMemberPoints,
    getFamilyLeaderboard,
    
    // Utility functions
    resetWeeklyStats,
    resetDailyStats
  };
};