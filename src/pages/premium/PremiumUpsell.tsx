import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Crown, CheckCircle, Monitor, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PremiumUpsell: React.FC = () => {
  const navigate = useNavigate();
  
  const handleCheckout = () => {
    const checkoutUrl = import.meta.env.VITE_CHECKOUT_URL || '#';
    if (checkoutUrl !== '#') {
      window.open(checkoutUrl, '_blank');
    } else {
      console.log('URL de checkout será configurada em breve');
    }
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <Button
        variant="ghost"
        onClick={() => navigate('/app')}
        className="mb-6 hover:bg-primary/10"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar ao Dashboard
      </Button>

      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 mb-4">
          <Crown className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-500 to-yellow-700 bg-clip-text text-transparent">
          Torne-se Premium
        </h1>
        <p className="text-xl text-muted-foreground mb-2">
          Tenha acesso a ferramentas fundamentais na
        </p>
        <p className="text-xl font-semibold text-secondary">
          reeducação digital dos seus filhos
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Monitor de Tempo de Tela */}
        <Card className="p-6 border-2 border-yellow-200 bg-gradient-to-br from-card to-yellow-50">
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <Monitor className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-blue-600">Monitor de Tempo de Tela</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            Dashboard em tempo real do uso familiar
          </p>
          <ul className="space-y-2">
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm">Dashboard em tempo real da família</span>
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm">Gráficos detalhados de uso por criança</span>
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm">Alertas automáticos de limites</span>
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm">Metas personalizáveis por faixa etária</span>
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm">Relatórios semanais de progresso</span>
            </li>
          </ul>
        </Card>

        {/* Planejador de Atividades */}
        <Card className="p-6 border-2 border-yellow-200 bg-gradient-to-br from-card to-yellow-50">
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-green-600">Planejador de Atividades Offline</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            Agenda semanal personalizada por criança
          </p>
          <ul className="space-y-2">
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm">Agenda semanal personalizada por criança</span>
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm">Biblioteca com 200+ atividades categorizadas</span>
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm">Sugestões inteligentes baseadas na idade</span>
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm">Sistema de conquistas e gamificação</span>
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm">Acompanhamento de conclusão de atividades</span>
            </li>
          </ul>
        </Card>
      </div>

      {/* CTA Principal */}
      <Card className="p-8 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-center">
        <div className="mb-6">
          <p className="text-3xl font-bold mb-2">Por apenas</p>
          <p className="text-5xl font-black">R$ 14,90</p>
          <p className="text-xl opacity-90">/mês</p>
        </div>
        
        <Button 
          onClick={handleCheckout}
          size="lg"
          className="bg-white text-yellow-600 hover:bg-gray-100 text-xl font-bold py-6 px-12 mb-4"
          data-testid="premium-checkout-button"
        >
          🛒 QUERO SER PREMIUM AGORA! 🛒
        </Button>
        
        <p className="text-sm opacity-90">
          ✅ Cancele quando quiser • 7 dias de garantia
        </p>
        <p className="text-sm opacity-90 mt-1">
          Acesso imediato às ferramentas exclusivas
        </p>
      </Card>
    </div>
  );
};

export default PremiumUpsell;