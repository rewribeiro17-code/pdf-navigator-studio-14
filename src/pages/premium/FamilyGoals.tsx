import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, Target, Trophy, Star, Gift, Plus, Users, Calendar, Award, Crown, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useScreenTimeStorage } from '@/hooks/useScreenTimeStorage';
import { useFamilyGoalsStorage } from '@/hooks/useFamilyGoalsStorage';
import { FamilyGoal, GoalReward, Badge as BadgeType } from '@/types';

const FamilyGoals: React.FC = () => {
  const navigate = useNavigate();
  const { familyMembers } = useScreenTimeStorage();
  const { 
    familyGoals,
    familyPoints,
    availableRewards,
    createFamilyGoal,
    updateGoalProgress,
    completeGoal,
    getActiveGoals,
    getCompletedGoals,
    initializeMemberPoints,
    awardPoints,
    awardBadge,
    redeemReward,
    getMemberPoints,
    getFamilyLeaderboard
  } = useFamilyGoalsStorage();

  const [activeTab, setActiveTab] = useState<'goals' | 'leaderboard' | 'rewards'>('goals');
  const [isCreateGoalOpen, setIsCreateGoalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    type: 'individual' as 'individual' | 'family' | 'challenge',
    targetValue: 60,
    duration: 7,
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    participants: [] as string[]
  });

  // Initialize points for all family members
  useEffect(() => {
    familyMembers.forEach(member => {
      initializeMemberPoints(member.id);
    });
  }, [familyMembers]);

  // Simulate goal progress updates
  useEffect(() => {
    const activeGoals = getActiveGoals();
    activeGoals.forEach(goal => {
      // Simulate daily progress
      if (goal.type === 'individual' && Math.random() > 0.7) {
        const progress = Math.min(goal.currentProgress + Math.floor(Math.random() * 20), goal.targetValue);
        updateGoalProgress(goal.id, progress);
        
        // Complete goal if target reached
        if (progress >= goal.targetValue) {
          setTimeout(() => completeGoal(goal.id), 1000);
        }
      }
    });
  }, []);

  const handleCreateGoal = () => {
    if (!newGoal.title || !newGoal.description) return;

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + newGoal.duration);

    const participants = newGoal.type === 'family' 
      ? familyMembers.map(m => m.id)
      : newGoal.participants;

    createFamilyGoal({
      title: newGoal.title,
      description: newGoal.description,
      type: newGoal.type,
      targetValue: newGoal.targetValue,
      startDate: new Date().toISOString(),
      endDate: endDate.toISOString(),
      participants,
      rewards: availableRewards.slice(0, 2),
      difficulty: newGoal.difficulty
    });

    setIsCreateGoalOpen(false);
    setNewGoal({
      title: '',
      description: '',
      type: 'individual',
      targetValue: 60,
      duration: 7,
      difficulty: 'medium',
      participants: []
    });
  };

  const handleRedeemReward = (memberId: string, rewardId: string) => {
    const success = redeemReward(memberId, rewardId);
    if (success) {
      // Show success message or notification
      console.log('Reward redeemed successfully!');
    }
  };

  const getDifficultyColor = (difficulty: FamilyGoal['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRarityColor = (rarity: BadgeType['rarity']) => {
    switch (rarity) {
      case 'common': return 'text-gray-600';
      case 'rare': return 'text-blue-600';
      case 'epic': return 'text-purple-600';
      case 'legendary': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const formatDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} dias`;
  };

  const activeGoals = getActiveGoals();
  const completedGoals = getCompletedGoals();
  const leaderboard = getFamilyLeaderboard();

  if (familyMembers.length === 0) {
    return (
      <div className="animate-fade-in max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/premium')}
          className="mb-6 hover:bg-primary/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao Dashboard Premium
        </Button>

        <Card className="p-8 text-center">
          <Target className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-4">Metas Familiares</h2>
          <p className="text-muted-foreground mb-6">
            Adicione membros da família para começar a criar metas e desafios.
          </p>
          <Button onClick={() => navigate('/premium/screen-time')}>
            Gerenciar Família
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-6xl mx-auto">
      <Button
        variant="ghost"
        onClick={() => navigate('/premium')}
        className="mb-6 hover:bg-primary/10"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar ao Dashboard Premium
      </Button>

      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Target className="h-8 w-8 text-green-600 mr-3" />
          <div>
            <h1 className="text-3xl font-bold">Metas Familiares</h1>
            <p className="text-muted-foreground">
              Gamificação e desafios para toda a família
            </p>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === 'goals' ? 'default' : 'outline'}
            onClick={() => setActiveTab('goals')}
          >
            <Target className="h-4 w-4 mr-2" />
            Metas
          </Button>
          <Button
            variant={activeTab === 'leaderboard' ? 'default' : 'outline'}
            onClick={() => setActiveTab('leaderboard')}
          >
            <Trophy className="h-4 w-4 mr-2" />
            Ranking
          </Button>
          <Button
            variant={activeTab === 'rewards' ? 'default' : 'outline'}
            onClick={() => setActiveTab('rewards')}
          >
            <Gift className="h-4 w-4 mr-2" />
            Recompensas
          </Button>
        </div>
      </div>

      {/* Goals Tab */}
      {activeTab === 'goals' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Metas Ativas</h2>
            <Dialog open={isCreateGoalOpen} onOpenChange={setIsCreateGoalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Meta
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Criar Nova Meta</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Título da Meta</label>
                    <Input
                      placeholder="Ex: Reduzir tempo de tela em 30 minutos"
                      value={newGoal.title}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Descrição</label>
                    <Input
                      placeholder="Descreva como atingir essa meta..."
                      value={newGoal.description}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Tipo de Meta</label>
                      <Select 
                        value={newGoal.type} 
                        onValueChange={(value: any) => setNewGoal(prev => ({ ...prev, type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="individual">Individual</SelectItem>
                          <SelectItem value="family">Familiar</SelectItem>
                          <SelectItem value="challenge">Desafio</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Dificuldade</label>
                      <Select 
                        value={newGoal.difficulty} 
                        onValueChange={(value: any) => setNewGoal(prev => ({ ...prev, difficulty: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Fácil (10 pontos)</SelectItem>
                          <SelectItem value="medium">Médio (25 pontos)</SelectItem>
                          <SelectItem value="hard">Difícil (50 pontos)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Meta (minutos)</label>
                      <Input
                        type="number"
                        value={newGoal.targetValue}
                        onChange={(e) => setNewGoal(prev => ({ ...prev, targetValue: parseInt(e.target.value) || 60 }))}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Duração (dias)</label>
                      <Input
                        type="number"
                        value={newGoal.duration}
                        onChange={(e) => setNewGoal(prev => ({ ...prev, duration: parseInt(e.target.value) || 7 }))}
                      />
                    </div>
                  </div>

                  {newGoal.type === 'individual' && (
                    <div>
                      <label className="text-sm font-medium">Participantes</label>
                      <div className="space-y-2 mt-2">
                        {familyMembers.map(member => (
                          <div key={member.id} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={member.id}
                              checked={newGoal.participants.includes(member.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewGoal(prev => ({ 
                                    ...prev, 
                                    participants: [...prev.participants, member.id] 
                                  }));
                                } else {
                                  setNewGoal(prev => ({ 
                                    ...prev, 
                                    participants: prev.participants.filter(id => id !== member.id) 
                                  }));
                                }
                              }}
                            />
                            <label htmlFor={member.id}>{member.name}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleCreateGoal} className="flex-1">
                      Criar Meta
                    </Button>
                    <Button variant="outline" onClick={() => setIsCreateGoalOpen(false)}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {activeGoals.length === 0 ? (
            <Card className="p-8 text-center">
              <Target className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-bold mb-2">Nenhuma meta ativa</h3>
              <p className="text-muted-foreground mb-4">
                Crie sua primeira meta familiar para começar a gamificação!
              </p>
              <Button onClick={() => setIsCreateGoalOpen(true)}>
                Criar Primeira Meta
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeGoals.map(goal => {
                const progress = (goal.currentProgress / goal.targetValue) * 100;
                const participantNames = goal.participants
                  .map(id => familyMembers.find(m => m.id === id)?.name)
                  .filter(Boolean)
                  .join(', ');

                return (
                  <Card key={goal.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1">{goal.title}</h3>
                        <p className="text-muted-foreground text-sm mb-2">{goal.description}</p>
                        <div className="flex gap-2 mb-3">
                          <Badge variant="outline" className={getDifficultyColor(goal.difficulty)}>
                            {goal.difficulty}
                          </Badge>
                          <Badge variant="outline">
                            {goal.type === 'individual' ? <Users className="h-3 w-3 mr-1" /> : 
                             goal.type === 'family' ? <Users className="h-3 w-3 mr-1" /> : 
                             <Trophy className="h-3 w-3 mr-1" />}
                            {goal.type}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progresso</span>
                          <span>{goal.currentProgress} / {goal.targetValue} min</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Participantes</p>
                          <p className="font-medium">{participantNames || 'Toda a família'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Duração</p>
                          <p className="font-medium">{formatDuration(goal.startDate, goal.endDate)}</p>
                        </div>
                      </div>

                      {progress >= 100 && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="flex items-center gap-2 text-green-800">
                            <Trophy className="h-4 w-4" />
                            <span className="font-medium">Meta Concluída! 🎉</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Completed Goals */}
          {completedGoals.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Metas Concluídas</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {completedGoals.slice(0, 6).map(goal => (
                  <Card key={goal.id} className="p-4 bg-green-50 border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="h-5 w-5 text-green-600" />
                      <h3 className="font-medium">{goal.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{goal.description}</p>
                    <div className="mt-2">
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        Concluída
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Leaderboard Tab */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Ranking Familiar</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leaderboard.map((memberPoints, index) => {
              const member = familyMembers.find(m => m.id === memberPoints.memberId);
              if (!member) return null;

              return (
                <Card key={memberPoints.memberId} className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold text-lg">
                      {index === 0 ? '👑' : index + 1}
                    </div>
                    <div>
                      <h3 className="font-bold">{member.name}</h3>
                      <p className="text-muted-foreground">{member.age} anos</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Pontos Totais</span>
                      <span className="font-bold text-yellow-600">{memberPoints.totalPoints}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Hoje</span>
                      <span className="font-medium">{memberPoints.earnedToday}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Esta Semana</span>
                      <span className="font-medium">{memberPoints.earnedThisWeek}</span>
                    </div>

                    {memberPoints.streak > 0 && (
                      <div className="flex items-center gap-2 text-orange-600">
                        <Flame className="h-4 w-4" />
                        <span>{memberPoints.streak} dias seguidos</span>
                      </div>
                    )}

                    {memberPoints.badges.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Badges Recentes</p>
                        <div className="flex gap-1 flex-wrap">
                          {memberPoints.badges.slice(0, 3).map(badge => (
                            <span
                              key={badge.id}
                              className={`text-lg ${getRarityColor(badge.rarity)}`}
                              title={badge.title}
                            >
                              {badge.icon}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Rewards Tab */}
      {activeTab === 'rewards' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Loja de Recompensas</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableRewards.map(reward => (
              <Card key={reward.id} className="p-6">
                <div className="text-center mb-4">
                  <span className="text-4xl mb-2 block">{reward.icon}</span>
                  <h3 className="font-bold">{reward.title}</h3>
                  <p className="text-muted-foreground text-sm">{reward.description}</p>
                </div>

                <div className="text-center mb-4">
                  <span className="text-2xl font-bold text-yellow-600">
                    {reward.pointsRequired} pontos
                  </span>
                </div>

                <div className="space-y-2">
                  {familyMembers.map(member => {
                    const memberPoints = getMemberPoints(member.id);
                    const canRedeem = memberPoints && memberPoints.totalPoints >= reward.pointsRequired;

                    return (
                      <div key={member.id} className="flex items-center justify-between">
                        <span className="text-sm">{member.name}</span>
                        <Button
                          size="sm"
                          variant={canRedeem ? "default" : "outline"}
                          disabled={!canRedeem}
                          onClick={() => handleRedeemReward(member.id, reward.id)}
                        >
                          {canRedeem ? 'Resgatar' : 'Insuficiente'}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyGoals;