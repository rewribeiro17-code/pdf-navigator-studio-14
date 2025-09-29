import { useState, useEffect } from 'react';
import { SmartAlert } from '@/types';

interface AlertSettings {
  dailyLimitWarnings: boolean;
  goalAchievements: boolean;
  weeklyReports: boolean;
  screenTimeReminders: boolean;
  focusModeReminders: boolean;
}

interface AlertsStorageData {
  alerts: SmartAlert[];
  alertSettings: AlertSettings;
}

const STORAGE_KEY = 'smartAlertsData';

const defaultSettings: AlertSettings = {
  dailyLimitWarnings: true,
  goalAchievements: true,
  weeklyReports: true,
  screenTimeReminders: true,
  focusModeReminders: true
};

const defaultData: AlertsStorageData = {
  alerts: [],
  alertSettings: defaultSettings
};

export const useSmartAlertsStorage = () => {
  const [data, setData] = useState<AlertsStorageData>(defaultData);
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
      console.error('Error loading smart alerts data:', error);
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
        console.error('Error saving smart alerts data:', error);
      }
    }
  }, [data, isLoading]);

  const addAlert = (alert: Omit<SmartAlert, 'id' | 'createdAt' | 'isRead'>) => {
    const newAlert: SmartAlert = {
      ...alert,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      isRead: false
    };

    setData(prev => ({
      ...prev,
      alerts: [newAlert, ...prev.alerts]
    }));

    return newAlert.id;
  };

  const markAsRead = (alertId: string) => {
    setData(prev => ({
      ...prev,
      alerts: prev.alerts.map(alert => 
        alert.id === alertId ? { ...alert, isRead: true } : alert
      )
    }));
  };

  const markAllAsRead = () => {
    setData(prev => ({
      ...prev,
      alerts: prev.alerts.map(alert => ({ ...alert, isRead: true }))
    }));
  };

  const dismissAlert = (alertId: string) => {
    setData(prev => ({
      ...prev,
      alerts: prev.alerts.filter(alert => alert.id !== alertId)
    }));
  };

  const updateSettings = (newSettings: Partial<AlertSettings>) => {
    setData(prev => ({
      ...prev,
      alertSettings: { ...prev.alertSettings, ...newSettings }
    }));
  };

  const getUnreadCount = (): number => {
    return data.alerts.filter(alert => !alert.isRead).length;
  };

  return {
    alerts: data.alerts,
    alertSettings: data.alertSettings,
    isLoading,
    addAlert,
    markAsRead,
    markAllAsRead,
    dismissAlert,
    updateSettings,
    getUnreadCount
  };
};