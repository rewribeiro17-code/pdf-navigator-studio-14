import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Monitor, Crown, BarChart3, Bell, Target, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PremiumDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in">
      <Button
        variant="ghost"
        onClick={() => navigate('/app')}
        className="mb-6 hover:bg-primary/10"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar ao Dashboard
      </Button>

      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 mb-4">
          <Crown className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-yellow-500 to-yellow-700 bg-clip-text text-transparent">
          Ferramentas Premium
        </h1>
        <p className="text-lg text-muted-foreground">
          Acesso exclusivo às suas ferramentas de reeducação digital
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {/* Monitor de Tempo de Tela */}
        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-blue-200 bg-gradient-to-br from-card to-blue-50"
              onClick={() => navigate('/premium/screen-time')}>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
              <Monitor className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-blue-600">Monitor de Tempo de Tela</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Acompanhe o uso de dispositivos da sua família em tempo real
            </p>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              Acessar Monitor
            </Button>
          </div>
        </Card>

        {/* Relatórios Semanais */}
        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-green-200 bg-gradient-to-br from-card to-green-50"
              onClick={() => navigate('/premium/weekly-reports')}>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-green-600">Relatórios Semanais</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Análise detalhada do progresso e conquistas da família
            </p>
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              Ver Relatórios
            </Button>
          </div>
        </Card>

        {/* Alertas Inteligentes */}
        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-purple-200 bg-gradient-to-br from-card to-purple-50"
              onClick={() => navigate('/premium/smart-alerts')}>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 mb-4">
              <Bell className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-purple-600">Alertas Inteligentes</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Notificações contextuais quando limites são atingidos
            </p>
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
              Gerenciar Alertas
            </Button>
          </div>
        </Card>

        {/* Metas Familiares */}
        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-yellow-200 bg-gradient-to-br from-card to-yellow-50"
              onClick={() => navigate('/premium/family-goals')}>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 mb-4">
              <Target className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-yellow-600">Metas Familiares</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Gamificação com pontos, badges e desafios familiares
            </p>
            <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
              Criar Metas
            </Button>
          </div>
        </Card>

        {/* Modo Foco */}
        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-indigo-200 bg-gradient-to-br from-card to-indigo-50 md:col-span-2"
              onClick={() => navigate('/premium/focus-mode')}>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 mb-4">
              <Brain className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-indigo-600">Modo Foco</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Timer educativo para períodos focados sem distrações digitais
            </p>
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
              Iniciar Sessão
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PremiumDashboard;