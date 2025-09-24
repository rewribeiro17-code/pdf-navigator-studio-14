export interface User {
  id: string;
  email: string;
  name: string;
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
}