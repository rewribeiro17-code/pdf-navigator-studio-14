import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Clock, TrendingUp, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ScreenTimeMonitor: React.FC = () => {
  const navigate = useNavigate();

  // Dados mock para demonstração
  const familyMembers = [
    {
      id: '1',
      name: 'João',
      age: 8,
      todayUsage: 135, // minutes
      limit: 120,
      status: 'over' as const,
      weeklyData: [45, 120, 90, 135, 110, 160, 95]
    },
    {
      id: '2',
      name: 'Maria',
      age: 12,
      todayUsage: 165, // minutes
      limit: 180,
      status: 'warning' as const,
      weeklyData: [120, 180, 150, 165, 140, 190, 145]
    },
    {
      id: '3',
      name: 'Pai',
      age: 35,
      todayUsage: 90, // minutes
      limit: 120,
      status: 'good' as const,
      weeklyData: [60, 90, 75, 90, 85, 100, 70]
    }
  ];

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
        <h1 className="text-3xl font-bold mb-2">📊 Monitor de Tempo de Tela</h1>
        <p className="text-muted-foreground">Acompanhe o uso de dispositivos da sua família em tempo real</p>
      </div>

      {/* Cards dos Membros da Família */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {familyMembers.map((member) => (
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
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Uso hoje:</span>
                <span className="font-semibold">{formatTime(member.todayUsage)}</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-muted-foreground">Limite:</span>
                <span className="font-semibold">{formatTime(member.limit)}</span>
              </div>
              
              {/* Barra de Progresso */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div 
                  className={`h-2 rounded-full ${
                    member.status === 'over' ? 'bg-red-500' : 
                    member.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min((member.todayUsage / member.limit) * 100, 100)}%` }}
                ></div>
              </div>
              
              {/* Status */}
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                {getStatusIcon(member.status)}
                <span className="ml-1">{getStatusText(member.status)}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Gráfico Semanal */}
      <Card className="p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">📈 Uso Semanal da Família</h3>
        <div className="space-y-4">
          {familyMembers.map((member) => (
            <div key={member.id} className="border rounded-lg p-4">
              <h4 className="font-medium mb-3">{member.name}</h4>
              <div className="flex items-end space-x-2 h-32">
                {member.weeklyData.map((usage, index) => {
                  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
                  const height = (usage / Math.max(...member.weeklyData)) * 100;
                  return (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div 
                        className="bg-blue-500 rounded-t w-full min-h-[4px]" 
                        style={{ height: `${height}%` }}
                      ></div>
                      <span className="text-xs mt-2 text-muted-foreground">{days[index]}</span>
                      <span className="text-xs text-muted-foreground">{formatTime(usage)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Metas e Alertas */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">🎯 Metas da Semana</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>João: 2h/dia</span>
              <span className="text-green-600">✅ 3/7 dias</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Maria: 3h/dia</span>
              <span className="text-yellow-600">⚠️ 5/7 dias</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Pai: 2h/dia</span>
              <span className="text-green-600">✅ 6/7 dias</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">🔔 Alertas Ativos</h3>
          <div className="space-y-3">
            <div className="flex items-center text-red-600">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <span className="text-sm">João ultrapassou 15min do limite hoje</span>
            </div>
            <div className="flex items-center text-blue-600">
              <Clock className="h-4 w-4 mr-2" />
              <span className="text-sm">Hora do jantar sem telas em 30min</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ScreenTimeMonitor;