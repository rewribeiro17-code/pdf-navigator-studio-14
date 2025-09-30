import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, UserPlus, Trash2, Users, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useScreenTimeStorage } from '@/hooks/useScreenTimeStorage';
import { useToast } from '@/hooks/use-toast';

const FamilyManagement: React.FC = () => {
  const navigate = useNavigate();
  const { familyMembers, addFamilyMember, removeFamilyMember } = useScreenTimeStorage();
  const { toast } = useToast();
  
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [dailyLimit, setDailyLimit] = useState('120');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !age) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha nome e idade.',
        variant: 'destructive',
      });
      return;
    }

    addFamilyMember({
      name,
      age: parseInt(age),
      dailyLimit: parseInt(dailyLimit),
      currentUsage: 0,
    });

    toast({
      title: 'Membro adicionado!',
      description: `${name} foi adicionado à família com sucesso.`,
    });

    // Reset form
    setName('');
    setAge('');
    setDailyLimit('120');
  };

  const handleDelete = (id: string, memberName: string) => {
    removeFamilyMember(id);
    toast({
      title: 'Membro removido',
      description: `${memberName} foi removido da família.`,
    });
  };

  return (
    <div className="animate-fade-in max-w-6xl mx-auto">
      <Button
        variant="ghost"
        onClick={() => navigate('/premium')}
        className="mb-6 hover:bg-primary/10"
        data-testid="button-back-premium"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar ao Dashboard Premium
      </Button>

      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Users className="h-8 w-8 text-teal-600 mr-3" />
          <div>
            <h1 className="text-3xl font-bold">Gerenciar Família</h1>
            <p className="text-muted-foreground">
              Adicione membros da família para usar as ferramentas premium
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add Member Form */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <UserPlus className="h-5 w-5 mr-2" />
            Adicionar Membro
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: João"
                data-testid="input-member-name"
              />
            </div>

            <div>
              <Label htmlFor="age">Idade</Label>
              <Input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Ex: 10"
                min="1"
                max="99"
                data-testid="input-member-age"
              />
            </div>

            <div>
              <Label htmlFor="dailyLimit">Limite Diário (minutos)</Label>
              <Input
                id="dailyLimit"
                type="number"
                value={dailyLimit}
                onChange={(e) => setDailyLimit(e.target.value)}
                placeholder="120"
                min="30"
                max="480"
                data-testid="input-daily-limit"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Recomendado: 60-120 min para crianças, 120-180 min para adolescentes
              </p>
            </div>

            <Button type="submit" className="w-full" data-testid="button-add-member">
              <UserPlus className="h-4 w-4 mr-2" />
              Adicionar Membro
            </Button>
          </form>
        </Card>

        {/* Family Members List */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Membros da Família ({familyMembers.length})
          </h2>

          {familyMembers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Nenhum membro adicionado ainda.</p>
              <p className="text-sm">Use o formulário ao lado para começar.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {familyMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg border hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/premium/family/edit/${member.id}`)}
                  data-testid={`member-card-${member.id}`}
                >
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{member.name}</h3>
                    <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                      <span>{member.age} anos</span>
                      <span>•</span>
                      <span>{member.dailyLimit} min/dia</span>
                    </div>
                    {member.apps && member.apps.length > 0 && (
                      <p className="text-xs text-teal-600 mt-2">
                        ✓ Perfil configurado
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/premium/family/edit/${member.id}`);
                      }}
                      className="hover:bg-teal/10 hover:text-teal-600"
                      data-testid={`button-edit-${member.id}`}
                    >
                      <Edit className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(member.id, member.name);
                      }}
                      className="hover:bg-destructive/10 hover:text-destructive"
                      data-testid={`button-delete-${member.id}`}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Quick Access Cards */}
      {familyMembers.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
            <h3 className="font-bold mb-2">Próximo Passo: Modo Foco</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Crie sessões de foco personalizadas para seus filhos
            </p>
            <Button 
              onClick={() => navigate('/premium/focus-mode')}
              className="bg-indigo-600 hover:bg-indigo-700"
              data-testid="button-goto-focus"
            >
              Ir para Modo Foco
            </Button>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <h3 className="font-bold mb-2">Acompanhe o Progresso</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Veja relatórios semanais detalhados da família
            </p>
            <Button 
              onClick={() => navigate('/premium/weekly-reports')}
              className="bg-green-600 hover:bg-green-700"
              data-testid="button-goto-reports"
            >
              Ver Relatórios
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
};

export default FamilyManagement;
