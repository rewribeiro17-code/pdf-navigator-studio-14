import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CheckCircle2, AlertCircle, TrendingUp, FileCheck, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useScreenTimeStorage } from '@/hooks/useScreenTimeStorage';
import { useQuestionnaireResponses } from '@/hooks/useQuestionnaireResponses';
import { questionnaires } from '@/data/questionnaires';
import { calculateScore, generateFeedback } from '@/lib/questionnaireAnalysis';
import type { QuestionnaireResponse } from '@/types/questionnaire';

const WeeklyReports: React.FC = () => {
  const navigate = useNavigate();
  const { familyMembers } = useScreenTimeStorage();
  const { saveResponse, getResponseByMemberAndQuestionnaire } = useQuestionnaireResponses();
  
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [selectedQuestionnaireId, setSelectedQuestionnaireId] = useState<string>('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [currentResult, setCurrentResult] = useState<QuestionnaireResponse | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showResult && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [showResult]);

  const selectedMember = familyMembers.find(m => m.id === selectedMemberId);
  const selectedQuestionnaire = questionnaires.find(q => q.id === selectedQuestionnaireId);

  const handleAnswerChange = (questionId: string, optionId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = () => {
    if (!selectedQuestionnaire || !selectedMemberId) return;

    const score = calculateScore(selectedQuestionnaire, answers);
    const feedback = generateFeedback(selectedQuestionnaire, answers, score);

    const response: QuestionnaireResponse = {
      id: `${selectedMemberId}-${selectedQuestionnaireId}-${Date.now()}`,
      questionnaireId: selectedQuestionnaireId,
      familyMemberId: selectedMemberId,
      completedDate: new Date().toISOString(),
      answers,
      totalScore: score,
      level: feedback.level,
      feedback,
    };

    saveResponse(response);
    setCurrentResult(response);
    setShowResult(true);
  };

  const handleStartNew = () => {
    setAnswers({});
    setShowResult(false);
    setCurrentResult(null);
    setSelectedQuestionnaireId('');
  };

  const handleBackToStart = () => {
    setAnswers({});
    setShowResult(false);
    setCurrentResult(null);
    setSelectedQuestionnaireId('');
    setSelectedMemberId('');
  };

  const allQuestionsAnswered = selectedQuestionnaire 
    ? selectedQuestionnaire.questions.every(q => answers[q.id])
    : false;

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'excellent': return 'text-green-700 bg-green-50 border-green-200';
      case 'moderate': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'needs-attention': return 'text-red-700 bg-red-50 border-red-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'excellent': return <CheckCircle2 className="h-16 w-16 text-green-600" />;
      case 'moderate': return <TrendingUp className="h-16 w-16 text-amber-600" />;
      case 'needs-attention': return <AlertCircle className="h-16 w-16 text-red-600" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToStart}
            className="gap-2"
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Questionários de Progresso
          </h1>
          <p className="text-gray-600">
            Responda aos questionários para acompanhar o progresso de cada etapa do método
          </p>
        </div>

        {/* Member Selection */}
        {!showResult && (
          <Card className="p-6 mb-6" data-testid="card-member-selection">
            <h3 className="text-lg font-semibold mb-4">1. Selecione o membro da família</h3>
            <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
              <SelectTrigger data-testid="select-member">
                <SelectValue placeholder="Escolha um membro da família" />
              </SelectTrigger>
              <SelectContent>
                {familyMembers.map((member) => (
                  <SelectItem key={member.id} value={member.id} data-testid={`option-member-${member.id}`}>
                    {member.name} ({member.age} anos)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Card>
        )}

        {/* Questionnaire Selection */}
        {selectedMemberId && !selectedQuestionnaireId && !showResult && (
          <Card className="p-6 mb-6" data-testid="card-questionnaire-selection">
            <h3 className="text-lg font-semibold mb-4">2. Escolha a etapa para avaliar</h3>
            <div className="grid gap-4">
              {questionnaires.map((q) => (
                <button
                  key={q.id}
                  onClick={() => setSelectedQuestionnaireId(q.id)}
                  className="text-left p-4 border-2 border-gray-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-all"
                  data-testid={`button-select-questionnaire-${q.id}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-teal-700">{q.stageNumber}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{q.stageTitle}</h4>
                      <p className="text-sm text-gray-600">{q.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        )}

        {/* Questionnaire Form */}
        {selectedQuestionnaire && !showResult && (
          <Card className="p-6 mb-6" data-testid="card-questionnaire-form">
            <div className="mb-6">
              <Badge className="mb-2">Etapa {selectedQuestionnaire.stageNumber}</Badge>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedQuestionnaire.stageTitle}</h2>
              <p className="text-gray-600">{selectedQuestionnaire.description}</p>
            </div>

            <div className="space-y-8">
              {selectedQuestionnaire.questions.map((question, index) => (
                <div key={question.id} className="pb-6 border-b border-gray-200 last:border-0" data-testid={`question-${question.id}`}>
                  <h4 className="font-semibold text-gray-900 mb-4">
                    {index + 1}. {question.text}
                  </h4>
                  <RadioGroup
                    value={answers[question.id] || ''}
                    onValueChange={(value) => handleAnswerChange(question.id, value)}
                  >
                    <div className="space-y-3">
                      {question.options.map((option) => (
                        <div
                          key={option.id}
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                          data-testid={`option-${question.id}-${option.id}`}
                        >
                          <RadioGroupItem value={option.id} id={`${question.id}-${option.id}`} />
                          <Label htmlFor={`${question.id}-${option.id}`} className="flex-1 cursor-pointer">
                            {option.text}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              ))}
            </div>

            <div className="mt-8 flex gap-4">
              <Button
                onClick={handleStartNew}
                variant="outline"
                data-testid="button-cancel"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!allQuestionsAnswered}
                className="flex-1"
                data-testid="button-submit"
              >
                <FileCheck className="h-4 w-4 mr-2" />
                Ver Resultado
              </Button>
            </div>
          </Card>
        )}

        {/* Results */}
        {showResult && currentResult && (
          <div ref={resultsRef} className="space-y-6">
            {/* Score Card */}
            <Card className={`p-8 border-2 ${getLevelColor(currentResult.level)}`} data-testid="card-result">
              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  {getLevelIcon(currentResult.level)}
                </div>
                <h2 className="text-3xl font-bold mb-2">{currentResult.feedback.levelLabel}</h2>
                <div className="text-5xl font-bold mb-4">{currentResult.feedback.scorePercentage}%</div>
                <p className="text-lg">{currentResult.feedback.summary}</p>
              </div>
              
              <Progress value={currentResult.feedback.scorePercentage} className="h-3 mb-4" />
              
              <div className="text-center text-sm text-gray-600">
                Avaliação completada em {new Date(currentResult.completedDate).toLocaleDateString('pt-BR')}
              </div>
            </Card>

            {/* Strengths */}
            {currentResult.feedback.strengths.length > 0 && (
              <Card className="p-6 bg-green-50 border-green-200" data-testid="card-strengths">
                <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  Pontos Fortes
                </h3>
                <ul className="space-y-2">
                  {currentResult.feedback.strengths.map((strength, idx) => (
                    <li key={idx} className="flex gap-2 text-green-800">
                      <span className="text-green-600">✓</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Areas of Attention */}
            {currentResult.feedback.areasOfAttention.length > 0 && (
              <Card className="p-6 bg-amber-50 border-amber-200" data-testid="card-attention">
                <h3 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Áreas que Precisam de Atenção
                </h3>
                <ul className="space-y-2">
                  {currentResult.feedback.areasOfAttention.map((area, idx) => (
                    <li key={idx} className="flex gap-2 text-amber-800">
                      <span className="text-amber-600">•</span>
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Tips */}
            {currentResult.feedback.tips.length > 0 && (
              <Card className="p-6 bg-blue-50 border-blue-200" data-testid="card-tips">
                <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Dicas para Melhorar
                </h3>
                <ul className="space-y-2">
                  {currentResult.feedback.tips.map((tip, idx) => (
                    <li key={idx} className="flex gap-2 text-blue-800">
                      <span className="text-blue-600">💡</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Next Steps */}
            {currentResult.feedback.nextSteps.length > 0 && (
              <Card className="p-6 bg-purple-50 border-purple-200" data-testid="card-next-steps">
                <h3 className="text-xl font-bold text-purple-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Próximos Passos
                </h3>
                <ul className="space-y-2">
                  {currentResult.feedback.nextSteps.map((step, idx) => (
                    <li key={idx} className="flex gap-2 text-purple-800">
                      <span className="text-purple-600">{idx + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                onClick={() => navigate('/premium')}
                variant="outline"
                className="flex-1"
                data-testid="button-back-dashboard"
              >
                Voltar ao Dashboard
              </Button>
              <Button
                onClick={handleStartNew}
                className="flex-1"
                data-testid="button-new-questionnaire"
              >
                Responder Outro Questionário
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyReports;
