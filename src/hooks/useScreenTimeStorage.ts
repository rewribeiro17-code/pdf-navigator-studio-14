import { useState, useEffect } from 'react';
import { FamilyMember, ScreenTimeData } from '@/types';

interface DailyUsage {
  memberId: string;
  date: string;
  usage: number; // minutes
  apps: { name: string; usage: number }[];
}

interface StorageData {
  familyMembers: FamilyMember[];
  dailyUsage: DailyUsage[];
  goals: { [memberId: string]: number }; // weekly goals in minutes
}

const STORAGE_KEY = 'screenTimeData';

const defaultData: StorageData = {
  familyMembers: [],
  dailyUsage: [],
  goals: {}
};

export const useScreenTimeStorage = () => {
  const [data, setData] = useState<StorageData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedData = JSON.parse(stored);
        setData({ ...defaultData, ...parsedData });
      }
    } catch (error) {
      console.error('Error loading screen time data:', error);
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
        console.error('Error saving screen time data:', error);
      }
    }
  }, [data, isLoading]);

  // Helper functions
  const addFamilyMember = (member: Omit<FamilyMember, 'id' | 'currentUsage'>) => {
    const newMember: FamilyMember = {
      ...member,
      id: Date.now().toString(),
      currentUsage: 0
    };
    
    setData(prev => ({
      ...prev,
      familyMembers: [...prev.familyMembers, newMember]
    }));
    
    return newMember.id;
  };

  const updateFamilyMember = (id: string, updates: Partial<FamilyMember>) => {
    setData(prev => ({
      ...prev,
      familyMembers: prev.familyMembers.map(member =>
        member.id === id ? { ...member, ...updates } : member
      )
    }));
  };

  const removeFamilyMember = (id: string) => {
    setData(prev => ({
      ...prev,
      familyMembers: prev.familyMembers.filter(member => member.id !== id),
      dailyUsage: prev.dailyUsage.filter(usage => usage.memberId !== id),
      goals: Object.fromEntries(
        Object.entries(prev.goals).filter(([memberId]) => memberId !== id)
      )
    }));
  };

  const addDailyUsage = (memberId: string, usage: number, apps: { name: string; usage: number }[] = []) => {
    const today = new Date().toISOString().split('T')[0];
    
    setData(prev => {
      // Remove existing entry for today if it exists
      const filteredUsage = prev.dailyUsage.filter(
        entry => !(entry.memberId === memberId && entry.date === today)
      );
      
      // Add new entry
      const newUsage: DailyUsage = {
        memberId,
        date: today,
        usage,
        apps
      };
      
      // Update current usage for the member
      const updatedMembers = prev.familyMembers.map(member =>
        member.id === memberId ? { ...member, currentUsage: usage } : member
      );
      
      return {
        ...prev,
        familyMembers: updatedMembers,
        dailyUsage: [...filteredUsage, newUsage]
      };
    });
  };

  const getWeeklyUsage = (memberId: string): ScreenTimeData[] => {
    const today = new Date();
    const weekData: ScreenTimeData[] = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayUsage = data.dailyUsage.find(
        usage => usage.memberId === memberId && usage.date === dateStr
      );
      
      weekData.push({
        date: dateStr,
        usage: dayUsage?.usage || 0,
        apps: dayUsage?.apps || []
      });
    }
    
    return weekData;
  };

  const setWeeklyGoal = (memberId: string, goalMinutes: number) => {
    setData(prev => ({
      ...prev,
      goals: {
        ...prev.goals,
        [memberId]: goalMinutes
      }
    }));
  };

  const getWeeklyGoal = (memberId: string): number => {
    return data.goals[memberId] || 0;
  };

  const getWeeklyProgress = (memberId: string): { completed: number; total: number } => {
    const weeklyUsage = getWeeklyUsage(memberId);
    const goal = getWeeklyGoal(memberId);
    const dailyGoal = goal / 7;
    
    const completed = weeklyUsage.filter(day => day.usage <= dailyGoal).length;
    
    return { completed, total: 7 };
  };

  const clearAllData = () => {
    setData(defaultData);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    familyMembers: data.familyMembers,
    dailyUsage: data.dailyUsage,
    isLoading,
    addFamilyMember,
    updateFamilyMember,
    removeFamilyMember,
    addDailyUsage,
    getWeeklyUsage,
    setWeeklyGoal,
    getWeeklyGoal,
    getWeeklyProgress,
    clearAllData
  };
};