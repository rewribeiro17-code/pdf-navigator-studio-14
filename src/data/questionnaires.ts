import type { Questionnaire } from '@/types/questionnaire';

export const questionnaires: Questionnaire[] = [
  {
    id: 'stage1-questionnaire',
    stageNumber: 1,
    stageTitle: 'Diagnóstico e Conscientização',
    description: 'Avalie como foi a primeira semana de observação e conscientização sobre o uso do smartphone',
    questions: [
      {
        id: 'q1-1',
        text: 'A criança/adolescente demonstrou entender que existe um problema com o uso do smartphone?',
        category: 'behavior',
        options: [
          { id: 'a', text: 'Sim, demonstrou compreensão e concordou que precisa mudar', score: 100 },
          { id: 'b', text: 'Demonstrou alguma compreensão, mas ainda resiste à ideia', score: 60 },
          { id: 'c', text: 'Negou completamente que exista um problema', score: 20 },
        ],
      },
      {
        id: 'q1-2',
        text: 'Como foi a reação ao fazer o diagnóstico do tempo de uso do smartphone?',
        category: 'resistance',
        options: [
          { id: 'a', text: 'Ficou surpreso(a) com o tempo de uso e se mostrou disposto(a) a mudanças', score: 100 },
          { id: 'b', text: 'Reconheceu o tempo de uso, mas tentou justificar', score: 60 },
          { id: 'c', text: 'Ficou irritado(a) ou defensivo(a) ao ver os dados', score: 20 },
        ],
      },
      {
        id: 'q1-3',
        text: 'Você conseguiu identificar os sinais de alerta mencionados no método?',
        category: 'progress',
        options: [
          { id: 'a', text: 'Sim, identifiquei claramente vários sinais de dependência', score: 100 },
          { id: 'b', text: 'Identifiquei alguns sinais, mas ainda tenho dúvidas', score: 60 },
          { id: 'c', text: 'Não consegui identificar os sinais ou não sei se estão presentes', score: 20 },
        ],
      },
      {
        id: 'q1-4',
        text: 'A família (pais/responsáveis) está alinhada sobre a necessidade de mudança?',
        category: 'progress',
        options: [
          { id: 'a', text: 'Sim, todos estão de acordo e comprometidos', score: 100 },
          { id: 'b', text: 'A maioria concorda, mas há alguma resistência', score: 60 },
          { id: 'c', text: 'Não, há muitas divergências entre os responsáveis', score: 20 },
        ],
      },
      {
        id: 'q1-5',
        text: 'Como está sendo o exemplo dos pais em relação ao uso do smartphone?',
        category: 'behavior',
        options: [
          { id: 'a', text: 'Estamos dando bom exemplo, limitando nosso próprio uso', score: 100 },
          { id: 'b', text: 'Estamos tentando melhorar, mas ainda usamos muito', score: 60 },
          { id: 'c', text: 'Reconhecemos que nosso exemplo não é bom', score: 20 },
        ],
      },
    ],
  },
  {
    id: 'stage2-questionnaire',
    stageNumber: 2,
    stageTitle: 'Limitação Gradual',
    description: 'Avalie como está sendo a implementação de regras e limites de uso do smartphone',
    questions: [
      {
        id: 'q2-1',
        text: 'As regras de uso do smartphone foram estabelecidas e compreendidas?',
        category: 'progress',
        options: [
          { id: 'a', text: 'Sim, as regras estão claras e todos as compreenderam', score: 100 },
          { id: 'b', text: 'As regras foram estabelecidas, mas ainda há confusão', score: 60 },
          { id: 'c', text: 'Ainda não conseguimos estabelecer regras claras', score: 20 },
        ],
      },
      {
        id: 'q2-2',
        text: 'A criança/adolescente está respeitando os limites de tempo estabelecidos?',
        category: 'usage',
        options: [
          { id: 'a', text: 'Sim, está respeitando os limites na maior parte do tempo', score: 100 },
          { id: 'b', text: 'Respeita às vezes, mas ainda há muitas negociações', score: 60 },
          { id: 'c', text: 'Não está respeitando, há conflitos constantes', score: 20 },
        ],
      },
      {
        id: 'q2-3',
        text: 'Como está sendo a reação quando o tempo de uso acaba?',
        category: 'resistance',
        options: [
          { id: 'a', text: 'Aceita bem e entrega o smartphone sem grandes problemas', score: 100 },
          { id: 'b', text: 'Reclama, mas eventualmente aceita', score: 60 },
          { id: 'c', text: 'Tem crises intensas, birras ou comportamento agressivo', score: 20 },
        ],
      },
      {
        id: 'q2-4',
        text: 'O uso do smartphone durante as refeições foi reduzido?',
        category: 'usage',
        options: [
          { id: 'a', text: 'Sim, as refeições estão livres de smartphones', score: 100 },
          { id: 'b', text: 'Melhorou, mas ainda há uso ocasional', score: 60 },
          { id: 'c', text: 'Não mudou, continua usando durante as refeições', score: 20 },
        ],
      },
      {
        id: 'q2-5',
        text: 'A qualidade do sono melhorou com a limitação do uso noturno?',
        category: 'behavior',
        options: [
          { id: 'a', text: 'Sim, está dormindo melhor e mais cedo', score: 100 },
          { id: 'b', text: 'Houve alguma melhora, mas ainda usa à noite', score: 60 },
          { id: 'c', text: 'Não mudou, continua usando até tarde', score: 20 },
        ],
      },
    ],
  },
  {
    id: 'stage3-questionnaire',
    stageNumber: 3,
    stageTitle: 'Substituição por Atividades',
    description: 'Avalie se as atividades alternativas estão funcionando e substituindo o tempo de tela',
    questions: [
      {
        id: 'q3-1',
        text: 'A criança/adolescente demonstrou interesse por atividades alternativas?',
        category: 'behavior',
        options: [
          { id: 'a', text: 'Sim, está explorando e gostando de novas atividades', score: 100 },
          { id: 'b', text: 'Demonstra algum interesse, mas ainda prefere o smartphone', score: 60 },
          { id: 'c', text: 'Não demonstra interesse, rejeita todas as sugestões', score: 20 },
        ],
      },
      {
        id: 'q3-2',
        text: 'Com que frequência as atividades alternativas são realizadas?',
        category: 'usage',
        options: [
          { id: 'a', text: 'Diariamente, já virou rotina', score: 100 },
          { id: 'b', text: '2-3 vezes por semana', score: 60 },
          { id: 'c', text: 'Raramente ou nunca', score: 20 },
        ],
      },
      {
        id: 'q3-3',
        text: 'A família está participando das atividades juntos?',
        category: 'progress',
        options: [
          { id: 'a', text: 'Sim, fazemos atividades em família regularmente', score: 100 },
          { id: 'b', text: 'Às vezes participamos juntos', score: 60 },
          { id: 'c', text: 'Não, as atividades são feitas sozinho(a)', score: 20 },
        ],
      },
      {
        id: 'q3-4',
        text: 'O tempo de uso do smartphone diminuiu com as atividades alternativas?',
        category: 'usage',
        options: [
          { id: 'a', text: 'Sim, reduziu significativamente (mais de 50%)', score: 100 },
          { id: 'b', text: 'Reduziu moderadamente (20-50%)', score: 60 },
          { id: 'c', text: 'Não reduziu ou reduziu muito pouco', score: 20 },
        ],
      },
      {
        id: 'q3-5',
        text: 'A criança/adolescente está mais feliz e disposto(a) no dia a dia?',
        category: 'behavior',
        options: [
          { id: 'a', text: 'Sim, notamos melhora significativa no humor e disposição', score: 100 },
          { id: 'b', text: 'Houve alguma melhora, mas ainda oscila', score: 60 },
          { id: 'c', text: 'Não notamos mudanças ou piorou', score: 20 },
        ],
      },
    ],
  },
  {
    id: 'stage4-questionnaire',
    stageNumber: 4,
    stageTitle: 'Reforço Positivo',
    description: 'Avalie a consolidação dos hábitos e a manutenção das conquistas alcançadas',
    questions: [
      {
        id: 'q4-1',
        text: 'Os novos hábitos estão se mantendo sem tanta supervisão?',
        category: 'progress',
        options: [
          { id: 'a', text: 'Sim, já está autorregulado(a) na maior parte do tempo', score: 100 },
          { id: 'b', text: 'Precisa de lembretes ocasionais', score: 60 },
          { id: 'c', text: 'Ainda precisa de supervisão constante', score: 20 },
        ],
      },
      {
        id: 'q4-2',
        text: 'As conquistas estão sendo reconhecidas e celebradas?',
        category: 'progress',
        options: [
          { id: 'a', text: 'Sim, sempre reconhecemos e celebramos os progressos', score: 100 },
          { id: 'b', text: 'Às vezes reconhecemos', score: 60 },
          { id: 'c', text: 'Não temos dado atenção às conquistas', score: 20 },
        ],
      },
      {
        id: 'q4-3',
        text: 'O diálogo sobre uso saudável da tecnologia está acontecendo?',
        category: 'behavior',
        options: [
          { id: 'a', text: 'Sim, conversamos abertamente e com frequência', score: 100 },
          { id: 'b', text: 'Conversamos ocasionalmente', score: 60 },
          { id: 'c', text: 'Não conversamos sobre o assunto', score: 20 },
        ],
      },
      {
        id: 'q4-4',
        text: 'Houve regressão ou retorno aos hábitos antigos?',
        category: 'resistance',
        options: [
          { id: 'a', text: 'Não, os novos hábitos estão consolidados', score: 100 },
          { id: 'b', text: 'Houve algumas recaídas pequenas, mas conseguimos retomar', score: 60 },
          { id: 'c', text: 'Sim, voltamos aos hábitos antigos', score: 20 },
        ],
      },
      {
        id: 'q4-5',
        text: 'As mudanças positivas se estenderam para outras áreas da vida?',
        category: 'behavior',
        options: [
          { id: 'a', text: 'Sim, notamos melhorias nas notas, sono, relacionamentos, etc.', score: 100 },
          { id: 'b', text: 'Notamos algumas melhorias em algumas áreas', score: 60 },
          { id: 'c', text: 'Não notamos mudanças em outras áreas', score: 20 },
        ],
      },
    ],
  },
];
