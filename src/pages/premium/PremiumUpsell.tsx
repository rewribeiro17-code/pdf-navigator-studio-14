import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Crown, CheckCircle, Timer, ClipboardCheck } from 'lucide-react';
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
        {/* Modo Foco */}
        <Card className="p-6 border-2 border-yellow-200 bg-gradient-to-br from-card to-yellow-50">
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-full bg-primary/10 mr-4">
              <Timer className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-primary">Modo Foco</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            Timer educativo com notificações completas
          </p>
          <ul className="space-y-2">
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm">Templates por faixa etária (6-10, 11-14, 15-17 anos)</span>
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm">Notificações do navegador para os pais</span>
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm">Alerta sonoro ao concluir</span>
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm">Vibração no celular</span>
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm">Pausar e retomar timer</span>
            </li>
          </ul>
        </Card>

        {/* Questionário de Progresso */}
        <Card className="p-6 border-2 border-yellow-200 bg-gradient-to-br from-card to-yellow-50">
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-full bg-secondary/10 mr-4">
              <ClipboardCheck className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="text-xl font-bold text-secondary">Questionário de Progresso</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            Sistema de avaliação do progresso educativo
          </p>
          <ul className="space-y-2">
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm">4 questionários (um para cada etapa)</span>
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm">5 perguntas por questionário</span>
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm">Análise automática com pontuação 0-100%</span>
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm">Feedback personalizado por nível</span>
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm">Dicas práticas para melhorar</span>
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