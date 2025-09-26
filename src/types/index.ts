export interface User {
  id: string;
  email: string;
  name: string;
  isPremium: boolean;
}

export interface Chapter {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  images?: string[];
  sections?: Section[];
}

export interface Section {
  id: string;
  title: string;
  content: string;
  type?: 'text' | 'list' | 'tips' | 'exercise';
  items?: string[];
}

export interface BookContent {
  title: string;
  subtitle: string;
  author: string;
  chapters: Chapter[];
  bonusBooks: BonusBook[];
}

export interface BonusBook {
  id: string;
  title: string;
  description: string;
  icon: string;
  pdfUrl?: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  age: number;
  dailyLimit: number; // minutes
  currentUsage: number; // minutes today
  avatar?: string;
}

export interface ScreenTimeData {
  date: string;
  usage: number; // minutes
  apps: { name: string; usage: number }[];
}

