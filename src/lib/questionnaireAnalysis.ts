import type { FeedbackResult, Questionnaire } from '@/types/questionnaire';

export function calculateScore(
  questionnaire: Questionnaire,
  answers: Record<string, string>
): number {
  let totalScore = 0;
  let questionCount = 0;

  questionnaire.questions.forEach((question) => {
    const answerId = answers[question.id];
    if (answerId) {
      const selectedOption = question.options.find((opt) => opt.id === answerId);
      if (selectedOption) {
        totalScore += selectedOption.score;
        questionCount++;
      }
    }
  });

  if (questionCount === 0) return 0;
  return Math.round(totalScore / questionCount);
}

export function determineLevel(score: number): 'needs-attention' | 'moderate' | 'excellent' {
  if (score < 50) return 'needs-attention';
  if (score < 80) return 'moderate';
  return 'excellent';
}

export function generateFeedback(
  questionnaire: Questionnaire,
  answers: Record<string, string>,
  score: number
): FeedbackResult {
  const level = determineLevel(score);
  const stageNumber = questionnaire.stageNumber;

  const feedbackData: Record<typeof level, {
    label: string;
    summary: Record<number, string>;
    strengths: Record<number, string[]>;
    areasOfAttention: Record<number, string[]>;
    tips: Record<number, string[]>;
    nextSteps: Record<number, string[]>;
  }> = {
    'needs-attention': {
      label: 'Necessita Atenção',
      summary: {
        1: 'A conscientização ainda está no início. É normal encontrar resistência nesta fase, mas é importante não desistir.',
        2: 'A implementação das regras está enfrentando dificuldades. Não desanime, mudanças comportamentais levam tempo.',
        3: 'As atividades alternativas ainda não estão engajando. Vamos ajustar a estratégia para encontrar o que funciona.',
        4: 'A consolidação dos hábitos precisa de mais trabalho. Vamos reforçar as estratégias anteriores.',
      },
      strengths: {
        1: ['Você deu o primeiro passo ao reconhecer que há um problema', 'Está buscando informações e métodos para ajudar'],
        2: ['Você não desistiu e está persistindo na implementação das regras', 'Reconheceu que mudanças são necessárias'],
        3: ['Você está tentando oferecer alternativas, mesmo que ainda não tenham funcionado', 'Continua buscando soluções'],
        4: ['Você chegou até a última etapa, demonstrando persistência', 'Ainda está comprometido(a) com a mudança'],
      },
      areasOfAttention: {
        1: [
          'A família pode não estar totalmente alinhada sobre a necessidade de mudança',
          'A criança/adolescente pode estar resistente ao diagnóstico',
          'Os sinais de dependência podem não estar claros para todos',
          'O exemplo dos pais em relação ao uso do smartphone pode precisar melhorar',
        ],
        2: [
          'As regras podem não estar suficientemente claras ou consistentes',
          'Pode estar havendo muitas negociações e flexibilizações',
          'As reações quando o tempo acaba estão sendo muito intensas',
          'O smartphone ainda está muito presente nas refeições e antes de dormir',
        ],
        3: [
          'As atividades alternativas oferecidas podem não estar adequadas aos interesses',
          'A criança/adolescente pode não estar vendo valor nas atividades',
          'Pode estar faltando participação da família nas atividades',
          'A redução do tempo de tela ainda não está acontecendo',
        ],
        4: [
          'Os novos hábitos ainda não se consolidaram',
          'Pode estar havendo regressão aos hábitos antigos',
          'As conquistas podem não estar sendo reconhecidas adequadamente',
          'O diálogo sobre uso saudável pode não estar acontecendo',
        ],
      },
      tips: {
        1: [
          'Reúna a família para alinhar expectativas e garantir que todos estejam comprometidos',
          'Use dados concretos do smartphone para mostrar o tempo real de uso',
          'Assista juntos documentários sobre dependência digital (ex: "O Dilema das Redes")',
          'Comece dando o exemplo: reduza seu próprio uso do smartphone',
          'Tenha paciência - a negação é uma reação comum e esperada',
        ],
        2: [
          'Revise as regras: elas precisam ser claras, específicas e aplicáveis',
          'Mantenha a consistência: não ceda às negociações ou birras',
          'Use ferramentas de controle parental para ajudar a implementar os limites',
          'Estabeleça consequências claras e cumpra-as sempre',
          'Comemore pequenas vitórias, mesmo que haja muitos conflitos',
          'Considere voltar à Etapa 1 se necessário - o diagnóstico pode precisar ser reforçado',
        ],
        3: [
          'Envolva a criança/adolescente na escolha das atividades alternativas',
          'Experimente diferentes tipos de atividades até encontrar as que funcionam',
          'Participe ativamente das atividades junto com seu filho(a)',
          'Torne as atividades divertidas, não obrigações chatas',
          'Comece com atividades curtas e aumente gradualmente',
          'Se necessário, volte à Etapa 2 e reforce as limitações antes de seguir',
        ],
        4: [
          'Reconheça e celebre cada progresso, por menor que seja',
          'Mantenha conversas abertas sobre tecnologia e seus impactos',
          'Esteja atento a sinais de regressão e aja imediatamente',
          'Continue dando o exemplo com seu próprio uso',
          'Considere revisitar as etapas anteriores para reforçar a base',
          'Seja paciente - cada pessoa tem seu tempo para entender e aceitar mudanças',
        ],
      },
      nextSteps: {
        1: [
          'Dedique uma semana para observação detalhada antes de implementar mudanças',
          'Organize uma reunião familiar para discussão aberta sobre o tema',
          'Documente os sinais de dependência observados',
          'Prepare-se emocionalmente para a resistência que virá',
        ],
        2: [
          'Crie um "contrato familiar" por escrito com regras claras',
          'Implemente as regras gradualmente, começando pelas mais importantes',
          'Estabeleça rotinas fixas (ex: sem celular nas refeições)',
          'Prepare-se para manter a firmeza nos primeiros conflitos',
        ],
        3: [
          'Faça uma lista de 10 atividades possíveis com seu filho(a)',
          'Experimente uma atividade nova por semana',
          'Reserve momentos específicos para atividades em família',
          'Documente as atividades que funcionaram melhor',
        ],
        4: [
          'Mantenha check-ins semanais sobre como está o uso do smartphone',
          'Continue celebrando conquistas regularmente',
          'Ajuste regras conforme necessário, mas sem retroceder',
          'Planeje atividades especiais como recompensa pelos progressos',
        ],
      },
    },
    'moderate': {
      label: 'Evoluindo Bem',
      summary: {
        1: 'Vocês estão no caminho certo! A conscientização está acontecendo, mesmo com alguns desafios.',
        2: 'As regras estão sendo implementadas com resultados moderados. Continue firme, os resultados virão!',
        3: 'As atividades alternativas estão começando a funcionar. Mantenha o ritmo e os resultados melhorarão!',
        4: 'Os novos hábitos estão se consolidando gradualmente. Vocês estão quase lá!',
      },
      strengths: {
        1: ['Há compreensão parcial ou total do problema', 'A família está começando a se alinhar', 'Alguns sinais de dependência foram identificados'],
        2: ['As regras foram estabelecidas', 'Há momentos de respeito aos limites', 'Algumas melhorias já são visíveis'],
        3: ['Há interesse em algumas atividades alternativas', 'O tempo de tela começou a reduzir', 'A família está participando'],
        4: ['Os novos hábitos estão se mantendo na maior parte do tempo', 'As conquistas estão sendo reconhecidas', 'Há diálogo sobre o tema'],
      },
      areasOfAttention: {
        1: [
          'Ainda há alguma resistência à mudança',
          'O alinhamento familiar pode precisar de reforço',
          'O exemplo dos pais pode ser inconsistente às vezes',
        ],
        2: [
          'As regras às vezes não são respeitadas completamente',
          'Ainda há negociações frequentes',
          'Alguns momentos críticos (refeições, sono) precisam melhorar',
        ],
        3: [
          'Nem todas as atividades estão funcionando',
          'A frequência das atividades alternativas pode aumentar',
          'O humor ainda oscila em alguns momentos',
        ],
        4: [
          'Ainda há necessidade de lembretes ocasionais',
          'Pequenas recaídas podem acontecer',
          'Algumas áreas da vida ainda não mostraram melhora',
        ],
      },
      tips: {
        1: [
          'Continue reforçando a conscientização através de conversas regulares',
          'Seja paciente com a resistência - ela vai diminuindo com o tempo',
          'Mantenha seu próprio exemplo consistente',
          'Celebre os momentos em que há compreensão do problema',
        ],
        2: [
          'Mantenha a consistência nas regras - não ceda às pressões',
          'Reforce positivamente quando as regras são respeitadas',
          'Ajuste regras que não estão funcionando, mas sem abandoná-las',
          'Crie rotinas que facilitem o cumprimento das regras',
        ],
        3: [
          'Continue explorando novas atividades até encontrar as favoritas',
          'Aumente gradualmente a frequência das atividades que funcionam',
          'Mantenha a participação ativa da família',
          'Reconheça e elogie o interesse demonstrado',
        ],
        4: [
          'Continue com os lembretes gentis quando necessário',
          'Reforce as conquistas para evitar regressões',
          'Mantenha as conversas abertas e sem julgamentos',
          'Ajuste estratégias se perceber recaídas',
        ],
      },
      nextSteps: {
        1: [
          'Agende conversas semanais sobre o uso do smartphone',
          'Reforce o alinhamento familiar regularmente',
          'Continue o diagnóstico com mais detalhes',
          'Prepare-se para avançar para a Etapa 2',
        ],
        2: [
          'Refine as regras que estão funcionando parcialmente',
          'Implemente consequências mais claras',
          'Estabeleça rotinas mais firmes',
          'Prepare atividades para a Etapa 3',
        ],
        3: [
          'Identifique as 3 atividades que mais funcionam e intensifique-as',
          'Crie um calendário semanal de atividades',
          'Envolva amigos nas atividades quando possível',
          'Prepare-se para consolidar na Etapa 4',
        ],
        4: [
          'Reduza gradualmente a supervisão',
          'Crie sistema de autorrecompensas',
          'Planeje manutenção de longo prazo',
          'Celebre a conclusão do método!',
        ],
      },
    },
    'excellent': {
      label: 'Excelente Progresso!',
      summary: {
        1: 'Parabéns! A conscientização está acontecendo de forma exemplar. A família está alinhada e pronta para as próximas etapas!',
        2: 'Fantástico! As regras estão sendo respeitadas e os primeiros resultados já são visíveis. Continue assim!',
        3: 'Maravilhoso! As atividades alternativas estão funcionando perfeitamente. Vocês encontraram o equilíbrio!',
        4: 'Incrível! Os novos hábitos estão consolidados. Vocês alcançaram uma transformação real e duradoura!',
      },
      strengths: {
        1: ['Excelente compreensão do problema por todos', 'Família totalmente alinhada', 'Diagnóstico bem feito e aceito', 'Ótimo exemplo dos pais'],
        2: ['Regras claras e bem respeitadas', 'Boa aceitação dos limites', 'Melhorias visíveis no sono e refeições', 'Conflitos mínimos'],
        3: ['Forte interesse nas atividades alternativas', 'Redução significativa do tempo de tela', 'Excelente participação familiar', 'Melhora notável no humor'],
        4: ['Hábitos consolidados', 'Autorregulação acontecendo', 'Conquistas celebradas', 'Diálogo aberto e frequente', 'Melhorias em várias áreas da vida'],
      },
      areasOfAttention: {
        1: ['Continue atento para manter esse alinhamento', 'Prepare-se para os desafios das próximas etapas'],
        2: ['Mantenha a consistência das regras', 'Esteja preparado para possíveis testes de limites'],
        3: ['Não deixe as atividades se tornarem obrigações chatas', 'Continue inovando com novas atividades'],
        4: ['Evite complacência - continue vigilante', 'Mantenha o equilíbrio sem ser excessivamente rígido'],
      },
      tips: {
        1: [
          'Mantenha esse alinhamento familiar - é a base de tudo!',
          'Use essa conscientização como motivação para as próximas etapas',
          'Continue dando o excelente exemplo que está dando',
          'Documente esse progresso para consultar depois se necessário',
        ],
        2: [
          'Mantenha a consistência que está funcionando tão bem',
          'Use esse sucesso para avançar confiante para a próxima etapa',
          'Continue elogiando o respeito às regras',
          'Comece a preparar atividades alternativas para a Etapa 3',
        ],
        3: [
          'Continue com essas atividades que estão funcionando perfeitamente',
          'Introduza variações para manter o interesse alto',
          'Use esse momento positivo para consolidar na Etapa 4',
          'Compartilhe suas estratégias bem-sucedidas com outras famílias',
        ],
        4: [
          'Parabéns pela transformação! Agora é manter',
          'Continue com check-ins regulares, mas sem pressão',
          'Use essa conquista como exemplo em outras áreas',
          'Celebre regularmente o quanto vocês evoluíram',
        ],
      },
      nextSteps: {
        1: [
          'Avance com confiança para a Etapa 2',
          'Comece a planejar as regras e limites',
          'Mantenha as conversas abertas e frequentes',
          'Continue fortalecendo o alinhamento familiar',
        ],
        2: [
          'Prepare-se para a Etapa 3 com entusiasmo',
          'Faça uma lista de atividades alternativas possíveis',
          'Mantenha as regras atuais firmes',
          'Celebre esse sucesso com a família',
        ],
        3: [
          'Avance para a Etapa 4 consolidando os hábitos',
          'Crie um plano de manutenção de longo prazo',
          'Continue com as atividades que funcionam',
          'Prepare celebração pela conclusão do método',
        ],
        4: [
          'Mantenha vigilância relaxada - confie no processo',
          'Faça check-ins mensais em vez de semanais',
          'Ajuste regras conforme a maturidade aumenta',
          'Inspire outras famílias compartilhando sua história de sucesso',
        ],
      },
    },
  };

  const data = feedbackData[level];
  
  return {
    level,
    levelLabel: data.label,
    scorePercentage: score,
    summary: data.summary[stageNumber],
    strengths: data.strengths[stageNumber] || [],
    areasOfAttention: data.areasOfAttention[stageNumber] || [],
    tips: data.tips[stageNumber] || [],
    nextSteps: data.nextSteps[stageNumber] || [],
  };
}
