// Tipos para o Sistema de Questionários de Evolução

export interface QuestionOption {
  id: string;
  text: string;
  score: number; // 0-100 pontos para cada opção
}

export interface Question {
  id: string;
  text: string;
  options: QuestionOption[];
  category: 'behavior' | 'usage' | 'resistance' | 'progress';
}

export interface Questionnaire {
  id: string;
  stageNumber: 1 | 2 | 3 | 4;
  stageTitle: string;
  description: string;
  questions: Question[];
}

export interface QuestionnaireResponse {
  id: string;
  questionnaireId: string;
  familyMemberId: string;
  completedDate: string;
  answers: Record<string, string>; // questionId -> optionId
  totalScore: number; // 0-100
  level: 'needs-attention' | 'moderate' | 'excellent';
  feedback: FeedbackResult;
}

export interface FeedbackResult {
  level: 'needs-attention' | 'moderate' | 'excellent';
  levelLabel: string;
  scorePercentage: number;
  summary: string;
  strengths: string[];
  areasOfAttention: string[];
  tips: string[];
  nextSteps: string[];
}
