import { useState, useEffect } from 'react';
import type { QuestionnaireResponse } from '@/types/questionnaire';

const STORAGE_KEY = 'questionnaireResponses';

export function useQuestionnaireResponses() {
  const [responses, setResponses] = useState<QuestionnaireResponse[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setResponses(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading questionnaire responses:', error);
        setResponses([]);
      }
    }
  }, []);

  const saveResponse = (response: QuestionnaireResponse) => {
    setResponses((prev) => {
      const filtered = prev.filter(
        (r) => !(r.questionnaireId === response.questionnaireId && r.familyMemberId === response.familyMemberId)
      );
      const updated = [...filtered, response];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const getResponseByMemberAndQuestionnaire = (
    familyMemberId: string,
    questionnaireId: string
  ): QuestionnaireResponse | undefined => {
    return responses.find(
      (r) => r.familyMemberId === familyMemberId && r.questionnaireId === questionnaireId
    );
  };

  const getResponsesByMember = (familyMemberId: string): QuestionnaireResponse[] => {
    return responses.filter((r) => r.familyMemberId === familyMemberId);
  };

  const deleteResponse = (responseId: string) => {
    setResponses((prev) => {
      const updated = prev.filter((r) => r.id !== responseId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return {
    responses,
    saveResponse,
    getResponseByMemberAndQuestionnaire,
    getResponsesByMember,
    deleteResponse,
  };
}
