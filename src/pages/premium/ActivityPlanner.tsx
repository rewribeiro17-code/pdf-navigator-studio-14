import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Trophy, Calendar, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ActivityPlanner: React.FC = () => {
  const navigate = useNavigate();
  const [selectedChild, setSelectedChild] = useState('joao');

  // Dados mock para demonstração
  const children = [
    { id: 'joao', name: 'João', age: 8 },
    { id: 'maria', name: 'Maria', age: 12 }
  ];

  const weekActivities = {
    joao: [
      { day: 'SEG', activity: 'Arte', icon: '🎨', duration: 30, completed: true },
      { day: 'TER', activity: 'Futebol', icon: '⚽', duration: 60, completed: true },
      { day: 'QUA', activity: 'Violão', icon: '🎵', duration: 45, completed: false },
      { day: 'QUI', activity: 'Leitura', icon: '📚', duration: 30, completed: false },
      { day: 'SEX', activity: 'Jogo Offline', icon: '🎮', duration: 45, completed: false },
      { day: 'SAB', activity: 'Bicicleta', icon: '🚴', duration: 120, completed: false },
      { day: 'DOM', activity: 'Família', icon: '👨‍👩‍👧‍👦', duration: 180, completed: false }
    ],
    maria: [
      { day: 'SEG', activity: 'Leitura', icon: '📖', duration: 45, completed: true },
      { day: 'TER', activity: 'Natação', icon: '🏊', duration: 60, completed: true },
      { day: 'QUA', activity: 'Teatro', icon: '🎭', duration: 90, completed: true },
      { day: 'QUI', activity: 'Experimentos', icon: '🧪', duration: 60, completed: false },
      { day: 'SEX', activity: 'Dança', icon: '👯', duration: 120, completed: false },
      { day: 'SAB', activity: 'Cinema', icon: '🎬', duration: 120, completed: false },
      { day: 'DOM', activity: 'Culinária', icon: '🍳', duration: 90, completed: false }
    ]
  };

  const suggestions = [
    { title: 'Circo na cidade', icon: '🎪', time: 'Final de semana', category: 'Evento' },
    { title: 'Trilha no parque', icon: '🌳', time: 'Domingo manhã', category: 'Atividade física' },
    { title: 'Aula de culinária em família', icon: '👨‍🍳', time: 'Sábado', category: 'Família' }
  ];

  const achievements = [
    { text: 'João completou 85% das atividades na semana passada', icon: '✅' },
    { text: 'Maria descobriu novo hobby: teatro! 🎭', icon: '🌟' }
  ];

  const formatDuration = (minutes: number) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${minutes}m`;
  };

  const currentChild = children.find(c => c.id === selectedChild);
  const activities = weekActivities[selectedChild as keyof typeof weekActivities] || [];

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

      {/* Seletor de Criança */}
      <div className="flex space-x-4 mb-8">
        {children.map((child) => (
          <Button
            key={child.id}
            variant={selectedChild === child.id ? "default" : "outline"}
            onClick={() => setSelectedChild(child.id)}
            className="flex-1 md:flex-none"
          >
            {child.name} ({child.age} anos)
          </Button>
        ))}
      </div>

      {/* Agenda Semanal */}
      <Card className="p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">
            Agenda de {currentChild?.name} - Semana 25/09 a 01/10
          </h3>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Atividade
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-4">
          {activities.map((item, index) => (
            <div key={index} className="text-center">
              <div className={`border-2 rounded-lg p-4 ${
                item.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="text-sm font-medium mb-1">{item.activity}</div>
                <div className="text-xs text-muted-foreground mb-2">{formatDuration(item.duration)}</div>
                <div className="text-xs font-medium">{item.day}</div>
                {item.completed && (
                  <div className="mt-2 text-green-600">✅</div>
                )}
              </div>
            </div>
          ))}
        </div>
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
                <span className="font-semibold ml-2">
                  {activities.filter(a => a.completed).length}/{activities.length}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Tempo offline:</span>
                <span className="font-semibold ml-2">
                  {formatDuration(activities.reduce((total, a) => total + (a.completed ? a.duration : 0), 0))}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ActivityPlanner;