import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Clock, TrendingUp, AlertTriangle, Plus, Edit, BarChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useScreenTimeStorage } from '@/hooks/useScreenTimeStorage';
import { FamilyMember } from '@/types';
import AddMemberDialog from '@/components/premium/AddMemberDialog';
import EditMemberDialog from '@/components/premium/EditMemberDialog';
import UsageEntryDialog from '@/components/premium/UsageEntryDialog';

const ScreenTimeMonitor: React.FC = () => {
  const navigate = useNavigate();
  const storage = useScreenTimeStorage();
  
  const [showAddMember, setShowAddMember] = useState(false);
  const [showEditMember, setShowEditMember] = useState(false);
  const [showUsageEntry, setShowUsageEntry] = useState(false);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);

  const handleAddMember = (memberData: { name: string; age: number; dailyLimit: number }) => {
    storage.addFamilyMember(memberData);
  };

  const handleEditMember = (member: FamilyMember) => {
    setSelectedMember(member);
    setShowEditMember(true);
  };

  const handleUsageEntry = (member: FamilyMember) => {
    setSelectedMember(member);
    setShowUsageEntry(true);
  };

  const getStatus = (usage: number, limit: number): 'over' | 'warning' | 'good' => {
    if (usage > limit) return 'over';
    if (usage > limit * 0.8) return 'warning';
    return 'good';
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'over': return 'bg-red-100 text-red-700 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'good': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'over': return <AlertTriangle className="h-4 w-4" />;
      case 'warning': return <Clock className="h-4 w-4" />;
      case 'good': return <TrendingUp className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'over': return 'Acima do limite';
      case 'warning': return 'Próximo do limite';
      case 'good': return 'Dentro do limite';
      default: return 'Normal';
    }
  };

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
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">📊 Monitor de Tempo de Tela</h1>
            <p className="text-muted-foreground">Acompanhe o uso de dispositivos da sua família em tempo real</p>
          </div>
          <Button onClick={() => setShowAddMember(true)} data-testid="button-add-member">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Membro
          </Button>
        </div>
      </div>

      {/* Cards dos Membros da Família */}
      {storage.familyMembers.length === 0 ? (
        <Card className="p-12 text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Nenhum membro na família</h3>
          <p className="text-muted-foreground mb-4">
            Adicione membros da família para começar a monitorar o tempo de tela
          </p>
          <Button onClick={() => setShowAddMember(true)} data-testid="button-add-first-member">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Primeiro Membro
          </Button>
        </Card>
      ) : (
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {storage.familyMembers.map((member) => {
            const status = getStatus(member.currentUsage, member.dailyLimit);
            return (
              <Card key={member.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.age} anos</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditMember(member)}
                    data-testid={`button-edit-${member.id}`}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Uso hoje:</span>
                    <span className="font-semibold">{formatTime(member.currentUsage)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-muted-foreground">Limite:</span>
                    <span className="font-semibold">{formatTime(member.dailyLimit)}</span>
                  </div>
                  
                  {/* Barra de Progresso */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div 
                      className={`h-2 rounded-full ${
                        status === 'over' ? 'bg-red-500' : 
                        status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min((member.currentUsage / member.dailyLimit) * 100, 100)}%` }}
                    ></div>
                  </div>
                  
                  {/* Status */}
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                    {getStatusIcon(status)}
                    <span className="ml-1">{getStatusText(status)}</span>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleUsageEntry(member)}
                  className="w-full"
                  data-testid={`button-usage-${member.id}`}
                >
                  <BarChart className="h-4 w-4 mr-2" />
                  Registrar Uso
                </Button>
              </Card>
            );
          })}
        </div>
      )}

      {/* Gráfico Semanal */}
      {storage.familyMembers.length > 0 && (
        <Card className="p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">📈 Uso Semanal da Família</h3>
          <div className="space-y-4">
            {storage.familyMembers.map((member) => {
              const weeklyData = storage.getWeeklyUsage(member.id);
              const maxUsage = Math.max(...weeklyData.map(d => d.usage), 1);
              
              return (
                <div key={member.id} className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">{member.name}</h4>
                  <div className="flex items-end space-x-2 h-32">
                    {weeklyData.map((dayData, index) => {
                      const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
                      const height = (dayData.usage / maxUsage) * 100;
                      const isOverLimit = dayData.usage > member.dailyLimit;
                      
                      return (
                        <div key={index} className="flex flex-col items-center flex-1">
                          <div 
                            className={`rounded-t w-full min-h-[4px] ${
                              isOverLimit ? 'bg-red-500' : 'bg-blue-500'
                            }`} 
                            style={{ height: `${Math.max(height, 4)}%` }}
                          ></div>
                          <span className="text-xs mt-2 text-muted-foreground">{days[index]}</span>
                          <span className="text-xs text-muted-foreground">{formatTime(dayData.usage)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Metas e Alertas */}
      {storage.familyMembers.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">🎯 Progresso Semanal</h3>
            <div className="space-y-3">
              {storage.familyMembers.map((member) => {
                const progress = storage.getWeeklyProgress(member.id);
                const percentage = (progress.completed / progress.total) * 100;
                
                return (
                  <div key={member.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>{member.name}: {formatTime(member.dailyLimit)}/dia</span>
                      <span className={`text-sm font-medium ${
                        percentage >= 70 ? 'text-green-600' : 
                        percentage >= 40 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {percentage >= 70 ? '✅' : percentage >= 40 ? '⚠️' : '❌'} {progress.completed}/{progress.total} dias
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${
                          percentage >= 70 ? 'bg-green-500' : 
                          percentage >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
              {storage.familyMembers.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Adicione membros para ver o progresso semanal
                </p>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">🔔 Alertas do Dia</h3>
            <div className="space-y-3">
              {storage.familyMembers.filter(member => member.currentUsage > member.dailyLimit).map(member => (
                <div key={member.id} className="flex items-center text-red-600">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <span className="text-sm">
                    {member.name} ultrapassou {formatTime(member.currentUsage - member.dailyLimit)} do limite
                  </span>
                </div>
              ))}
              {storage.familyMembers.filter(member => 
                member.currentUsage > member.dailyLimit * 0.8 && member.currentUsage <= member.dailyLimit
              ).map(member => (
                <div key={member.id} className="flex items-center text-yellow-600">
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="text-sm">
                    {member.name} está próximo do limite diário
                  </span>
                </div>
              ))}
              {storage.familyMembers.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Nenhum alerta no momento
                </p>
              )}
              {storage.familyMembers.length > 0 && 
               storage.familyMembers.every(member => member.currentUsage <= member.dailyLimit * 0.8) && (
                <div className="flex items-center text-green-600">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  <span className="text-sm">
                    Todos dentro dos limites! 🎉
                  </span>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Diálogos */}
      <AddMemberDialog
        open={showAddMember}
        onOpenChange={setShowAddMember}
        onAddMember={handleAddMember}
      />

      <EditMemberDialog
        open={showEditMember}
        onOpenChange={setShowEditMember}
        member={selectedMember}
        onUpdateMember={storage.updateFamilyMember}
        onRemoveMember={storage.removeFamilyMember}
      />

      <UsageEntryDialog
        open={showUsageEntry}
        onOpenChange={setShowUsageEntry}
        member={selectedMember}
        onAddUsage={storage.addDailyUsage}
      />
    </div>
  );
};

export default ScreenTimeMonitor;