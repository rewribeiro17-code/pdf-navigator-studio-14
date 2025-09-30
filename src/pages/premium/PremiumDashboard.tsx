import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Crown, BarChart3, Brain, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useScreenTimeStorage } from '@/hooks/useScreenTimeStorage';

const PremiumDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { familyMembers } = useScreenTimeStorage();

  return (
    <div className="animate-fade-in">
      <Button
        variant="ghost"
        onClick={() => navigate('/app')}
        className="mb-6 hover:bg-primary/10"
        data-testid="button-back-dashboard"
      >
        <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
        Voltar ao Dashboard
      </Button>

      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 mb-4">
          <Crown className="h-8 w-8 text-white" aria-hidden="true" />
        </div>
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-yellow-500 to-yellow-700 bg-clip-text text-transparent">
          Ferramentas Premium
        </h1>
        <p className="text-lg text-muted-foreground">
          Ferramentas essenciais para sua reeducação digital
        </p>
      </div>

      {/* Gerenciar Família - Destacado */}
      <Card className="p-8 mb-6 bg-gradient-to-r from-teal-500 to-teal-600 border-0 max-w-4xl mx-auto hover:shadow-xl transition-all"
            data-testid="card-family-management">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm">
              <Users className="h-8 w-8 text-white" aria-hidden="true" />
            </div>
            <div className="text-left">
              <h3 className="text-2xl font-bold mb-1">Gerenciar Família</h3>
              <p className="text-teal-50">
                {familyMembers.length === 0 
                  ? 'Adicione os membros da sua família para começar' 
                  : `${familyMembers.length} membro${familyMembers.length !== 1 ? 's' : ''} cadastrado${familyMembers.length !== 1 ? 's' : ''}`
                }
              </p>
            </div>
          </div>
          <Button size="lg" variant="secondary" className="bg-white text-teal-600 hover:bg-teal-50" onClick={() => navigate('/premium/family')} data-testid="button-manage-family">
            {familyMembers.length === 0 ? 'Começar' : 'Gerenciar'}
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Modo Foco */}
        <Card className="p-6 hover:shadow-lg transition-shadow border-2 border-indigo-200 bg-gradient-to-br from-card to-indigo-50"
              data-testid="card-focus-mode">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 mb-4">
              <Brain className="h-6 w-6 text-indigo-600" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-indigo-600">Modo Foco</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Timer educativo para períodos focados sem distrações digitais
            </p>
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700" onClick={() => navigate('/premium/focus-mode')} data-testid="button-focus-mode">
              Iniciar Sessão
            </Button>
          </div>
        </Card>

        {/* Relatórios Semanais */}
        <Card className="p-6 hover:shadow-lg transition-shadow border-2 border-green-200 bg-gradient-to-br from-card to-green-50"
              data-testid="card-weekly-reports">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
              <BarChart3 className="h-6 w-6 text-green-600" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-green-600">Relatórios Semanais</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Análise detalhada do progresso e conquistas da família
            </p>
            <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => navigate('/premium/weekly-reports')} data-testid="button-weekly-reports">
              Ver Relatórios
            </Button>
          </div>
        </Card>

      </div>
    </div>
  );
};

export default PremiumDashboard;