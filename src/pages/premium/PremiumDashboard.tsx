import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Monitor, Crown } from 'lucide-react';
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

      <div className="flex justify-center max-w-2xl mx-auto">
        {/* Monitor de Tempo de Tela */}
        <Card className="p-8 hover:shadow-lg transition-shadow cursor-pointer border-2 border-blue-200 bg-gradient-to-br from-card to-blue-50 w-full"
              onClick={() => navigate('/premium/screen-time')}>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
              <Monitor className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-blue-600">Monitor de Tempo de Tela</h3>
            <p className="text-muted-foreground mb-4">
              Acompanhe o uso de dispositivos da sua família em tempo real
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Acessar Monitor
            </Button>
          </div>
        </Card>
      </div>
      
      <div className="text-center mt-8 p-6 bg-gray-50 rounded-lg max-w-2xl mx-auto">
        <h3 className="text-lg font-semibold mb-2">🚀 Mais ferramentas em breve!</h3>
        <p className="text-muted-foreground">
          Estamos desenvolvendo novas funcionalidades premium para tornar a desintoxicação digital ainda mais eficaz.
        </p>
      </div>
    </div>
  );
};

export default PremiumDashboard;