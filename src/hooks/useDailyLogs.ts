import { useState, useEffect } from 'react';
import type { DailyLog } from '@/types';

const STORAGE_KEY = 'daily_logs';

export function useDailyLogs() {
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setDailyLogs(JSON.parse(stored));
    }
  }, []);

  const addDailyLog = (log: Omit<DailyLog, 'id'>) => {
    const newLog: DailyLog = {
      ...log,
      id: `daily-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    
    const updated = [...dailyLogs, newLog];
    setDailyLogs(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newLog;
  };

  const updateDailyLog = (id: string, updates: Partial<DailyLog>) => {
    const updated = dailyLogs.map(log =>
      log.id === id ? { ...log, ...updates } : log
    );
    setDailyLogs(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const deleteDailyLog = (id: string) => {
    const updated = dailyLogs.filter(log => log.id !== id);
    setDailyLogs(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const getLogsByMember = (familyMemberId: string) => {
    return dailyLogs.filter(log => log.familyMemberId === familyMemberId);
  };

  const getLogsByDateRange = (familyMemberId: string, startDate: string, endDate: string) => {
    return dailyLogs.filter(log => 
      log.familyMemberId === familyMemberId &&
      log.date >= startDate &&
      log.date <= endDate
    );
  };

  return {
    dailyLogs,
    addDailyLog,
    updateDailyLog,
    deleteDailyLog,
    getLogsByMember,
    getLogsByDateRange,
  };
}
