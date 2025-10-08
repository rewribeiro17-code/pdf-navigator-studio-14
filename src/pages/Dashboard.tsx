import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowRight, 
  BookOpen, 
  Trophy, 
  Target,
  Users,
  Sparkles,
  CheckCircle,
  Crown,
  Gift
} from 'lucide-react';
import { bookContent } from '@/data/bookContent';
import coverBg from '@/assets/cover-bg.jpg';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const totalChapters = bookContent.chapters.length;
  const readChapters = 0; // This could be tracked in a real app
  const progress = (readChapters / totalChapters) * 100;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl">
        <div className="absolute inset-0">
          <img 
            src={coverBg} 
            alt="Background" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/80" />
        </div>
        <div className="relative p-8 md:p-12 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
            {bookContent.title}
          </h1>
          <p className="text-lg md:text-xl mb-6 opacity-95 max-w-3xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {bookContent.subtitle}
          </p>
          <div className="flex items-center gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Button 
              size="lg"
              className="bg-white text-primary hover:bg-white/90"
              onClick={() => navigate('/app/intro')}
            >
              Começar Leitura
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2 text-white/90">
              <BookOpen className="h-5 w-5" />
              <span>{totalChapters} capítulos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Card */}
      <Card className="p-6 bg-gradient-to-r from-card to-primary/5 border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Seu Progresso
          </h2>
          <span className="text-sm text-muted-foreground">
            {readChapters} de {totalChapters} capítulos
          </span>
        </div>
        <Progress value={progress} className="h-3 mb-2" />
        <p className="text-sm text-muted-foreground">
          Continue lendo para desbloquear todo o conteúdo
        </p>
      </Card>

      {/* Key Features */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 hover:shadow-lg transition-all hover:scale-105 cursor-pointer border-primary/20">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center mb-4">
            <Target className="h-6 w-6 text-primary-foreground" />
          </div>
          <h3 className="font-semibold mb-2">Método Comprovado</h3>
          <p className="text-sm text-muted-foreground">
            4 etapas práticas baseadas em evidências científicas
          </p>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-all hover:scale-105 cursor-pointer border-secondary/20">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center mb-4">
            <Users className="h-6 w-6 text-secondary-foreground" />
          </div>
          <h3 className="font-semibold mb-2">+10 mil Famílias</h3>
          <p className="text-sm text-muted-foreground">
            Já transformaram suas vidas com este método
          </p>
        </Card>
      </div>

      {/* Quick Navigation */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Navegação Rápida - As 4 Etapas</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {bookContent.chapters.filter(chapter => chapter.id.startsWith('stage')).map((chapter) => (
            <Button
              key={chapter.id}
              variant="outline"
              className="justify-start text-left h-auto p-4 hover:bg-primary/5 hover:border-primary/50"
              onClick={() => navigate(`/app/${chapter.id}`)}
            >
              <div>
                <div className="font-semibold">{chapter.title}</div>
                {chapter.subtitle && (
                  <div className="text-sm text-muted-foreground mt-1">
                    {chapter.subtitle}
                  </div>
                )}
              </div>
            </Button>
          ))}
        </div>
      </Card>

      {/* Conclusion */}
      <Card className="p-8 bg-gradient-to-r from-accent/10 to-secondary/10 border-accent/30">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center flex-shrink-0">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">Conclusão</h2>
            <p className="text-muted-foreground mb-4">
              Uma nova vida para sua família. Transforme a relação com a tecnologia!
            </p>
            <Button 
              size="lg"
              onClick={() => navigate('/app/conclusion')}
              className="bg-gradient-to-r from-accent to-secondary hover:opacity-90"
            >
              Ler Conclusão
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Bonus Books */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center">
            <Gift className="h-6 w-6 text-accent-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Bônus Exclusivos</h2>
            <p className="text-sm text-muted-foreground">3 e-books adicionais para complementar sua jornada</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookContent.bonusBooks.map((book) => (
            <Button
              key={book.id}
              variant="outline"
              className="justify-start text-left h-auto p-4 hover:bg-accent/5 hover:border-accent/50"
              onClick={() => navigate(`/app/bonus/${book.id}`)}
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{book.icon}</span>
                <div>
                  <div className="font-semibold text-sm mb-1">{book.title}</div>
                  <div className="text-xs text-muted-foreground">{book.description}</div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </Card>

      {/* Premium CTA */}
      <Card className="p-8 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 border-yellow-300 dark:border-yellow-700">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 mb-4">
            <Crown className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Desbloqueie o Poder Completo</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            {user?.isPremium 
              ? 'Você tem acesso premium! Explore todas as ferramentas exclusivas.' 
              : 'Acesse ferramentas premium de monitoramento, relatórios semanais, alertas inteligentes, metas familiares e modo foco.'}
          </p>
          <Button 
            size="lg"
            onClick={() => navigate(user?.isPremium ? '/premium' : '/premium/upsell')}
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white font-semibold shadow-lg"
          >
            <Crown className="mr-2 h-5 w-5" />
            {user?.isPremium ? 'Acessar Dashboard Premium' : '✨ Fazer Upgrade Premium ⭐'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;