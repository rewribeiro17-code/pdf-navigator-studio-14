import { useState, useEffect } from 'react';
import type { WeeklyLog } from '@/types';

const STORAGE_KEY = 'weekly_logs';

export function useWeeklyLogs() {
  const [weeklyLogs, setWeeklyLogs] = useState<WeeklyLog[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setWeeklyLogs(JSON.parse(stored));
    }
  }, []);

  const addWeeklyLog = (log: Omit<WeeklyLog, 'id'>) => {
    const newLog: WeeklyLog = {
      ...log,
      id: `weekly-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    
    const updated = [...weeklyLogs, newLog];
    setWeeklyLogs(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newLog;
  };

  const updateWeeklyLog = (id: string, updates: Partial<WeeklyLog>) => {
    const updated = weeklyLogs.map(log =>
      log.id === id ? { ...log, ...updates } : log
    );
    setWeeklyLogs(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const deleteWeeklyLog = (id: string) => {
    const updated = weeklyLogs.filter(log => log.id !== id);
    setWeeklyLogs(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const getLogsByMember = (familyMemberId: string) => {
    return weeklyLogs.filter(log => log.familyMemberId === familyMemberId);
  };

  return {
    weeklyLogs,
    addWeeklyLog,
    updateWeeklyLog,
    deleteWeeklyLog,
    getLogsByMember,
  };
}
