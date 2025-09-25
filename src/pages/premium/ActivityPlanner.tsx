import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Trophy, Calendar, Clock, Edit3, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useScreenTimeStorage } from '@/hooks/useScreenTimeStorage';
import useActivityStorage from '@/hooks/useActivityStorage';
import AddActivityDialog from '@/components/premium/AddActivityDialog';
import WeeklyPlanDialog from '@/components/premium/WeeklyPlanDialog';
import { FamilyMember } from '@/types';

const ActivityPlanner: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const screenTimeStorage = useScreenTimeStorage();
  const activityStorage = useActivityStorage();
  
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [showWeeklyPlan, setShowWeeklyPlan] = useState(false);
  
  // Get family members from screen time storage
  const familyMembers = screenTimeStorage.familyMembers;
  
  // Set default selected member if none selected
  React.useEffect(() => {
    if (!selectedMember && familyMembers.length > 0) {
      setSelectedMember(familyMembers[0]);
    }
  }, [familyMembers, selectedMember]);

  // Get member activities and weekly plan
  const memberActivities = selectedMember ? activityStorage.getMemberActivities(selectedMember.id) : [];
  const weeklyPlan = selectedMember ? activityStorage.getWeeklyPlan(selectedMember.id) : null;
  const completionStats = selectedMember ? activityStorage.getCompletionStats(selectedMember.id) : { completed: 0, total: 0, percentage: 0 };
  const offlineTime = selectedMember ? activityStorage.getOfflineTime(selectedMember.id) : 0;
  
  // Handle adding new activity
  const handleAddActivity = (activity: Parameters<typeof activityStorage.addActivity>[1]) => {
    if (!selectedMember) return;
    activityStorage.addActivity(selectedMember.id, activity);
  };
  
  // Handle creating weekly plan
  const handleCreateWeeklyPlan = (activities: { day: string; activityId: string }[]) => {
    if (!selectedMember) return;
    activityStorage.createWeeklyPlan(selectedMember.id, activities);
  };
  
  // Handle activity completion toggle
  const toggleActivityCompletion = (day: string, activityId: string) => {
    if (!selectedMember) return;
    activityStorage.toggleActivityCompletion(selectedMember.id, day, activityId);
  };

  // Utility functions
  const formatDuration = (minutes: number) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${minutes}m`;
  };

  // Generate suggestions based on age
  const suggestions = selectedMember ? activityStorage.getDefaultActivities(selectedMember.age).slice(0, 3).map(activity => ({
    title: activity.title,
    icon: activity.icon,
    time: `${activity.duration}min`,
    category: activity.category === 'physical' ? 'Atividade física' : 
             activity.category === 'creative' ? 'Arte e Criatividade' :
             activity.category === 'educational' ? 'Educacional' :
             activity.category === 'social' ? 'Social' : 'Família'
  })) : [];

  // Generate achievements
  const achievements = [
    ...(completionStats.percentage >= 70 ? [{
      text: `${selectedMember?.name} completou ${completionStats.percentage}% das atividades esta semana! 🎉`,
      icon: '✅'
    }] : []),
    ...(offlineTime >= 300 ? [{
      text: `${selectedMember?.name} já acumulou ${formatDuration(offlineTime)} de tempo offline esta semana!`,
      icon: '🌟'
    }] : []),
    ...(memberActivities.length >= 5 ? [{
      text: `${selectedMember?.name} tem ${memberActivities.length} atividades personalizadas criadas!`,
      icon: '🎯'
    }] : [])
  ];


  // Get current week date range for display
  const currentDate = new Date();
  const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1));
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };
  
  if (familyMembers.length === 0) {
    return (
      <div className="animate-fade-in">
        <Button
          variant="ghost"
          onClick={() => navigate('/premium')}
          className="mb-6 hover:bg-primary/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar às Ferramentas
        </Button>

        <div className="text-center py-12">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">Nenhum membro da família encontrado</h2>
          <p className="text-muted-foreground mb-6">
            Primeiro adicione membros da família no Monitor de Tempo de Tela
          </p>
          <Button onClick={() => navigate('/premium/screen-time')}>
            Ir para Monitor de Tempo de Tela
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <Button
        variant="ghost"
        onClick={() => navigate('/premium')}
        className="mb-6 hover:bg-primary/10"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar às Ferramentas
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">📅 Planejador de Atividades</h1>
        <p className="text-muted-foreground">Organize atividades offline personalizadas para cada criança</p>
      </div>

      {/* Seletor de Membro da Família */}
      <div className="flex flex-wrap gap-4 mb-8">
        {familyMembers.map((member) => {
          const stats = activityStorage.getCompletionStats(member.id);
          return (
            <Button
              key={member.id}
              variant={selectedMember?.id === member.id ? "default" : "outline"}
              onClick={() => setSelectedMember(member)}
              className="flex-1 md:flex-none"
              data-testid={`button-select-${member.name.toLowerCase()}`}
            >
              {member.name} ({member.age} anos)
              {stats.total > 0 && (
                <span className="ml-2 text-xs opacity-75">
                  {stats.completed}/{stats.total}
                </span>
              )}
            </Button>
          );
        })}
      </div>

      {/* Agenda Semanal */}
      <Card className="p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">
            Agenda de {selectedMember?.name} - Semana {formatDate(startOfWeek)} a {formatDate(endOfWeek)}
          </h3>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setShowAddActivity(true)} data-testid="button-add-activity">
              <Plus className="h-4 w-4 mr-2" />
              Nova Atividade
            </Button>
            <Button 
              size="sm" 
              onClick={() => setShowWeeklyPlan(true)} 
              data-testid="button-plan-week"
              disabled={memberActivities.length === 0}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              {weeklyPlan ? 'Editar Plano' : 'Planejar Semana'}
            </Button>
          </div>
        </div>

        {weeklyPlan && weeklyPlan.activities.length > 0 ? (
          <div className="grid grid-cols-7 gap-4">
            {weeklyPlan.activities.map((planActivity, index) => (
              <div key={index} className="text-center">
                <div className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                  planActivity.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200 hover:bg-blue-50'
                }`}
                onClick={() => toggleActivityCompletion(planActivity.day, planActivity.activity.id)}
                data-testid={`activity-${planActivity.day.toLowerCase()}`}
                >
                  <div className="text-2xl mb-2">{planActivity.activity.icon}</div>
                  <div className="text-sm font-medium mb-1">{planActivity.activity.title}</div>
                  <div className="text-xs text-muted-foreground mb-2">{formatDuration(planActivity.activity.duration)}</div>
                  <div className="text-xs font-medium">{planActivity.day}</div>
                  {planActivity.completed ? (
                    <div className="mt-2 text-green-600">✅</div>
                  ) : (
                    <div className="mt-2 text-gray-400 hover:text-blue-500">
                      <Check className="h-4 w-4 mx-auto" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">
              {memberActivities.length === 0 
                ? 'Primeiro crie algumas atividades usando o botão "Nova Atividade" acima'
                : 'Use o botão "Planejar Semana" acima para organizar as atividades'
              }
            </p>
          </div>
        )}
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Sugestões da Semana */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            💡 Sugestões da Semana
          </h3>
          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center">
                  <span className="text-xl mr-3">{suggestion.icon}</span>
                  <div>
                    <p className="font-medium">{suggestion.title}</p>
                    <p className="text-sm text-muted-foreground">{suggestion.time}</p>
                  </div>
                </div>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                  {suggestion.category}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Conquistas */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Trophy className="h-5 w-5 mr-2" />
            🏆 Conquistas
          </h3>
          <div className="space-y-3">
            {achievements.map((achievement, index) => (
              <div key={index} className="flex items-start p-3 border rounded-lg bg-yellow-50 border-yellow-200">
                <span className="text-lg mr-3">{achievement.icon}</span>
                <p className="text-sm">{achievement.text}</p>
              </div>
            ))}
          </div>
          
          {/* Estatísticas */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <h4 className="font-medium mb-2">📊 Estatísticas desta semana:</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Atividades completadas:</span>
                <span className="font-semibold ml-2" data-testid="text-completed-activities">
                  {completionStats.completed}/{completionStats.total}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Tempo offline:</span>
                <span className="font-semibold ml-2" data-testid="text-offline-time">
                  {formatDuration(offlineTime)}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Diálogos */}
      <AddActivityDialog
        open={showAddActivity}
        onOpenChange={setShowAddActivity}
        member={selectedMember}
        onAddActivity={handleAddActivity}
      />

      <WeeklyPlanDialog
        open={showWeeklyPlan}
        onOpenChange={setShowWeeklyPlan}
        member={selectedMember}
        activities={memberActivities}
        onCreatePlan={handleCreateWeeklyPlan}
        existingPlan={weeklyPlan?.activities}
      />
    </div>
  );
};

export default ActivityPlanner;