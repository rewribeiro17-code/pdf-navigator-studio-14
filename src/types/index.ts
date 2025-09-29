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

// Weekly Reports Types
export interface WeeklyReport {
  id: string;
  familyMemberId: string;
  weekStartDate: string;
  totalUsage: number; // minutes
  dailyAverage: number;
  goalAchieved: boolean;
  improvementSuggestions: string[];
  topApps: { name: string; usage: number; category: string }[];
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedDate: string;
  type: 'goal' | 'streak' | 'improvement' | 'special';
}

// Smart Alerts Types
export interface SmartAlert {
  id: string;
  familyMemberId: string;
  type: 'warning' | 'limit_reached' | 'goal_achieved' | 'suggestion' | 'reminder';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  isRead: boolean;
  actionRequired?: boolean;
  relatedGoalId?: string;
}

// Family Goals Types
export interface FamilyGoal {
  id: string;
  title: string;
  description: string;
  type: 'individual' | 'family' | 'challenge';
  targetValue: number; // minutes or points
  currentProgress: number;
  startDate: string;
  endDate: string;
  participants: string[]; // family member IDs
  isActive: boolean;
  rewards: GoalReward[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface GoalReward {
  id: string;
  title: string;
  description: string;
  icon: string;
  pointsRequired: number;
  type: 'badge' | 'privilege' | 'activity';
}

export interface FamilyPoints {
  memberId: string;
  totalPoints: number;
  earnedToday: number;
  earnedThisWeek: number;
  badges: Badge[];
  streak: number; // days
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  earnedDate: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

// Focus Mode Types
export interface FocusSession {
  id: string;
  familyMemberId: string;
  startTime: string;
  endTime?: string;
  plannedDuration: number; // minutes
  actualDuration?: number; // minutes
  focusType: 'study' | 'family_time' | 'outdoor' | 'creative' | 'rest';
  completed: boolean;
  interrupted: boolean;
  interruptionReason?: string;
  productivity: number; // 1-5 rating
}

export interface FocusTemplate {
  id: string;
  name: string;
  description: string;
  duration: number; // minutes
  type: 'study' | 'family_time' | 'outdoor' | 'creative' | 'rest';
  icon: string;
  color: string;
  tips: string[];
  ageGroup: 'kids' | 'teens' | 'all';
}

