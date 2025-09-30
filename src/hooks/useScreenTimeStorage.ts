import { useState, useEffect } from 'react';
import { FamilyMember } from '@/types';

const STORAGE_KEY = 'family_members';

export const useScreenTimeStorage = () => {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setFamilyMembers(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading family members:', error);
      }
    }
  }, []);

  const saveFamilyMembers = (members: FamilyMember[]) => {
    setFamilyMembers(members);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
  };

  const addFamilyMember = (member: Omit<FamilyMember, 'id'>) => {
    const newMember: FamilyMember = {
      ...member,
      id: Date.now().toString(),
    };
    saveFamilyMembers([...familyMembers, newMember]);
    return newMember.id;
  };

  const updateFamilyMember = (id: string, updates: Partial<FamilyMember>) => {
    saveFamilyMembers(
      familyMembers.map(member => 
        member.id === id ? { ...member, ...updates } : member
      )
    );
  };

  const removeFamilyMember = (id: string) => {
    saveFamilyMembers(familyMembers.filter(member => member.id !== id));
  };

  const getWeeklyUsage = (memberId: string) => {
    const today = new Date();
    const weekData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Gerar dados simulados de uso diário
      const usage = Math.floor(Math.random() * 180) + 30; // 30-210 minutos
      
      weekData.push({
        date: date.toISOString().split('T')[0],
        usage,
      });
    }
    
    return weekData;
  };

  return {
    familyMembers,
    addFamilyMember,
    updateFamilyMember,
    removeFamilyMember,
    getWeeklyUsage,
  };
};
