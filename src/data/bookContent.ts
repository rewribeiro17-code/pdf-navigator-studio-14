import { BookContent } from '@/types';

export const bookContent: BookContent = {
  title: "Desintoxicação Digital Kids",
  subtitle: "Um método prático e eficaz que ajuda pais e tutores a reeducar crianças e adolescentes quanto ao uso de smartphones e redes sociais",
  author: "Isabella Centeno",
  chapters: [
    {
      id: "intro",
      title: "Introdução",
      subtitle: "Quem Sou Eu?",
      content: `Meu nome é Isabella Centeno, tenho 41 anos e sou especialista em desenvolvimento comportamental de crianças e adolescentes há 11 anos. Ao longo da minha carreira, já atendi mais de 10 mil famílias, ajudando-as a enfrentar desafios como o uso excessivo de smartphones e a dependência digital.

Criei o método "Desintoxicação Digital Kids", um programa prático e eficaz que já transformou a vida de milhares de crianças, adolescentes e suas famílias. Meu método é atestado e comprovado com base em evidências científicas, pesquisas de campo, e na minha vasta experiência de mais de onze anos na área.

Sei que, como pais e tutores, vocês querem o melhor para seus filhos, mas também entendem que o mundo digital é uma realidade inevitável. Por isso, este método foi criado, para ajudar vocês a encontrar o equilíbrio na vida familiar, promovendo uma relação saudável com a tecnologia.`,
      images: ["/src/assets/author.png"]
    },
    {
      id: "nomophobia",
      title: "O Que é Nomofobia?",
      subtitle: "Entendendo o vício em smartphones",
      content: `Nomofobia é o termo usado para descrever o medo ou a ansiedade de ficar sem o smartphone ou sem acesso a ele. A palavra vem da expressão em inglês "no mobile phone phobia". Essa condição tem se tornado cada vez mais comum entre crianças e adolescentes, que crescem em um mundo hiperconectado e dependente da tecnologia.

Infelizmente, o vício em telas de smartphones é algo que cresce em proporções catastróficas em todo mundo, principalmente em países onde o acesso aos dispositivos é mais fácil, e muitas vezes induzido pelos próprios pais.`,
      sections: [
        {
          id: "stats",
          title: "Dados Alarmantes Globais",
          type: "list",
          content: "Pesquisas revelam números preocupantes sobre o vício tecnológico:",
          items: [
            "🇺🇸 Estados Unidos: 50% dos adolescentes admitem sentir-se viciados em smartphones",
            "🇪🇸 Espanha: 77% dos jovens sentem ansiedade sem o celular",
            "🇧🇷 Brasil: 79% das crianças usam internet diariamente sem supervisão",
            "🇬🇧 Reino Unido: 78% dos adolescentes verificam o celular a cada hora",
            "🇦🇺 Austrália: 60% dos adolescentes sentem ansiedade sem smartphone"
          ]
        }
      ],
      images: ["/src/assets/nomophobia.jpg"]
    },
    {
      id: "impacts",
      title: "Malefícios do Vício",
      subtitle: "Como o smartphone afeta nossos filhos",
      content: `O uso excessivo de smartphones não é apenas um "hábito moderno", mas uma questão que pode impactar profundamente a saúde física, emocional e social dos jovens.`,
      sections: [
        {
          id: "physical",
          title: "Problemas de Saúde Física",
          type: "list",
          content: "",
          items: [
            "Dores musculares: Má postura ao usar o celular",
            "Distúrbios do sono: Luz azul interfere na melatonina",
            "Sedentarismo: Redução de atividades físicas",
            "Problemas de visão: Cansaço visual e miopia"
          ]
        },
        {
          id: "emotional",
          title: "Dificuldades Emocionais",
          type: "list",
          content: "",
          items: [
            "Ansiedade e depressão por comparação nas redes",
            "Irritabilidade quando o uso é limitado",
            "Dependência emocional do dispositivo",
            "Baixa autoestima e inadequação social"
          ]
        },
        {
          id: "cognitive",
          title: "Impactos Cognitivos",
          type: "list",
          content: "",
          items: [
            "Dificuldade de concentração",
            "Queda no rendimento escolar",
            "Redução da criatividade",
            "Problemas de memória e aprendizado"
          ]
        }
      ]
    },
    {
      id: "method",
      title: "O Método de Desintoxicação",
      subtitle: "4 etapas para transformar a vida dos seus filhos",
      content: `Meu Método de Desintoxicação Digital Kids é o resultado de anos de experiência e da convivência com diferentes personalidades de crianças e adolescentes. É um método prático e extremamente eficaz, dividido em quatro etapas fundamentais.`,
      sections: [
        {
          id: "steps",
          title: "As 4 Etapas",
          type: "list",
          content: "",
          items: [
            "1️⃣ Diagnóstico e Conscientização: Identificar o nível de dependência",
            "2️⃣ Limitação Gradual: Estabelecer regras claras e ferramentas de controle",
            "3️⃣ Substituição por Atividades: Oferecer alternativas prazerosas e saudáveis",
            "4️⃣ Reforço Positivo: Celebrar conquistas e manter diálogo aberto"
          ]
        }
      ],
      images: ["/src/assets/family1.jpg", "/src/assets/family2.jpg"]
    },
    {
      id: "stage1",
      title: "Etapa 1: Diagnóstico e Conscientização",
      subtitle: "Identificando o problema",
      content: `Esta é a etapa mais importante de todo o processo. Antes de implementar qualquer mudança, é fundamental fazer um diagnóstico preciso e conscientizar toda a família sobre a situação. Muitos pais cometem o erro de tentar limitar o uso do smartphone sem primeiro entender a extensão do problema ou preparar adequadamente o ambiente familiar.

O diagnóstico não é apenas sobre a criança - é também sobre você, como pai ou mãe. Reflita: qual é o seu próprio relacionamento com o smartphone? Você verifica o celular na frente dos seus filhos constantemente? Usa o telefone durante as refeições? Lembre-se: as crianças aprendem mais pelo que veem do que pelo que ouvem.

É natural que crianças e adolescentes resistam inicialmente a qualquer conversa sobre limitar o uso do smartphone. Eles podem negar que existe um problema, ficar irritados ou tentar barganhar. Esta resistência é normal e esperada - não desista no primeiro "não".`,
      sections: [
        {
          id: "warning-signs",
          title: "Sinais de Alerta por Faixa Etária",
          type: "list",
          content: "Identifique os sinais de dependência digital:",
          items: [
            "🧒 6-9 anos: Birras quando o tempo de tela acaba, preferir jogos a brincar fisicamente, dificuldade para dormir após usar telas",
            "🧑 10-13 anos: Queda nas notas, isolamento dos amigos, ansiedade quando não pode usar o celular, mentir sobre tempo de uso",
            "👤 14-17 anos: Perda de interesse em atividades antes prazerosas, mudanças drásticas de humor, problemas para acordar, relacionamentos familiares deteriorados"
          ]
        },
        {
          id: "usage-levels",
          title: "Níveis de Uso: Normal vs Problemático",
          type: "tips",
          content: "Aprenda a diferenciar:",
          items: [
            "✅ Uso Normal: 1-2h/dia, para tarefas específicas, sem interferir no sono/estudos",
            "⚠️ Uso Excessivo: 3-4h/dia, alguns conflitos familiares, impactos leves no rendimento",
            "🚨 Uso Viciante: +5h/dia, conflitos constantes, isolamento social, queda significativa nas notas"
          ]
        },
        {
          id: "observation",
          title: "Como Realizar o Diagnóstico Detalhado",
          type: "tips",
          content: "Observe durante uma semana completa:",
          items: [
            "📱 Tempo total: Use ferramentas do próprio telefone para medir horas exatas de uso",
            "⏰ Padrões horários: Primeiro uso ao acordar? Último antes de dormir? Uso durante madrugada?",
            "📍 Locais problemáticos: Usa na mesa de jantar? No banheiro? Escondido no quarto?",
            "😤 Reações emocionais: Como reage quando pede para guardar? Fica ansioso sem o aparelho?",
            "📚 Impactos acadêmicos: Notas em queda? Professores reclamando de distração?",
            "👨‍👩‍👧‍👦 Dinâmica familiar: Prefere ficar no quarto? Participa menos das conversas?",
            "😴 Qualidade do sono: Dificuldade para dormir? Cansaço excessivo pela manhã?",
            "🏃‍♂️ Atividade física: Abandonou esportes? Resistência a sair de casa?"
          ]
        },
        {
          id: "age-awareness",
          title: "Estratégias de Conscientização por Idade",
          type: "tips",
          content: "Adapte sua abordagem:",
          items: [
            "🧒 6-9 anos: 'Vamos fazer um experimento? Que tal descobrirmos coisas legais que podemos fazer sem o tablet?'",
            "🧑 10-13 anos: 'Você sabia que o smartphone foi criado para viciar? Vamos descobrir juntos como isso funciona?'",
            "👤 14-17 anos: 'Pesquisas mostram que jovens que controlam o uso de telas têm mais sucesso. Que tal conversarmos sobre isso?'"
          ]
        },
        {
          id: "family-preparation",
          title: "Preparação do Ambiente Familiar",
          type: "tips",
          content: "Antes de começar, organize a casa:",
          items: [
            "🤝 Alinhe com seu parceiro(a): Ambos devem estar na mesma página sobre regras e consequências",
            "🎯 Defina expectativas realistas: Mudanças levam 21-66 dias para se consolidar",
            "📋 Crie um 'contrato familiar': Regras claras que valem para todos, incluindo os pais",
            "🏠 Prepare o ambiente: Crie espaços livres de tela e locais para atividades alternativas",
            "💪 Fortaleça sua resolução: Haverá momentos difíceis - mantenha-se firme no propósito"
          ]
        },
        {
          id: "conversation",
          title: "Scripts para a Conversa Inicial",
          type: "tips",
          content: "Frases que funcionam:",
          items: [
            "💬 'Notei que todos nós em casa estamos usando muito o celular. Que tal fazermos uma mudança juntos?'",
            "🤔 'Você já percebeu como se sente quando não pode usar o celular? Vamos conversar sobre isso?'",
            "🎯 'Não quero tirar seu celular, quero ajudar você a usá-lo de forma mais inteligente'",
            "👨‍👩‍👧‍👦 'Esta não é uma punição - é sobre nossa família ter mais tempo de qualidade juntos'",
            "🚫 EVITE: 'Você é viciado', 'Quando eu era da sua idade...', 'Vou tirar seu celular'"
          ]
        },
        {
          id: "handling-resistance",
          title: "Transformando Resistência em Curiosidade",
          type: "tips",
          content: "Quando encontrar resistência:",
          items: [
            "😡 Raiva/Negação: 'Entendo sua frustração. Que tal começarmos devagar e você me mostrar como usa o celular?'",
            "🙄 Descrédito: 'Eu também tinha dúvidas. Vamos tentar por uma semana e ver o que acontece?'",
            "😰 Ansiedade: 'Não vamos tirar tudo de uma vez. Vamos fazer mudanças pequenas e graduais'",
            "🤝 Barganha: 'Vamos negociar sim, mas primeiro preciso entender melhor como você usa o celular'",
            "⏸️ Quando pausar: Se a criança está muito alterada, diga 'vamos continuar essa conversa mais tarde' e retome em algumas horas"
          ]
        }
      ]
    },
    {
      id: "stage2", 
      title: "Etapa 2: Limitação Gradual",
      subtitle: "Reduzindo o uso de forma sustentável",
      content: `Esta é a etapa onde colocamos as mãos na massa! Após o diagnóstico e conscientização, chegou o momento de implementar mudanças concretas e mensuráveis. A chave do sucesso está na gradualidade - mudanças drásticas geram resistência e fracasso, enquanto mudanças graduais criam hábitos duradouros.

É fundamental entender que não estamos "tirando" algo da criança, mas sim "reorganizando" o uso da tecnologia de forma mais inteligente e saudável. O objetivo não é eliminar o smartphone, mas criar uma relação equilibrada e consciente com ele.

Durante esta etapa, você perceberá que a resistência inicial começará a diminuir, especialmente se a Etapa 1 foi bem executada. As crianças e adolescentes começam a perceber que a vida sem o uso excessivo de telas pode ser prazerosa e gratificante.`,
      sections: [
        {
          id: "psychological-preparation",
          title: "Preparação Psicológica da Família",
          type: "tips",
          content: "Antes de implementar qualquer mudança, prepare emocionalmente toda a família:",
          items: [
            "💪 Fortaleça sua determinação: Haverá momentos difíceis - crises, chantagens, barganha. Mantenha-se firme no propósito",
            "🤝 Alinhe expectativas com parceiro(a): Ambos devem reagir da mesma forma às resistências e seguir as mesmas regras",
            "😌 Prepare-se para a 'síndrome de abstinência': Irritabilidade, ansiedade e humor alterado são normais nos primeiros dias",
            "🎯 Defina seu 'porquê': Lembre-se constantemente dos motivos que te levaram a tomar essa decisão",
            "📱 Seja o exemplo: Se você usa o celular excessivamente, a criança não levará as regras a sério",
            "⏰ Escolha o momento certo: Evite começar em períodos de estresse (provas, mudanças, doenças na família)",
            "🗣️ Comunique-se com escola: Informe os professores sobre o processo para que apoiem em casa"
          ]
        },
        {
          id: "physical-environment",
          title: "Criação do Ambiente Físico",
          type: "tips",
          content: "Organize a casa para facilitar o sucesso:",
          items: [
            "📵 Estação de carregamento central: Crie um local específico onde todos os celulares ficam durante refeições e à noite",
            "⏰ Relógio despertador tradicional: Retire o celular do quarto e use despertador comum",
            "📚 Biblioteca familiar: Organize livros, revistas e materiais de leitura em locais acessíveis",
            "🎨 Cantinho criativo: Disponibilize materiais de arte, jogos e atividades manuais",
            "🏠 Zonas livres de tela: Defina claramente quais ambientes são livres de dispositivos (quartos, sala de jantar)",
            "🔒 Armário com chave: Para guardar tablets e dispositivos extras durante o processo inicial",
            "📋 Quadro de regras visível: Afixe as regras acordadas em local onde todos possam ver"
          ]
        },
        {
          id: "expectations-timeline",
          title: "Gestão de Expectativas e Timeline",
          type: "tips",
          content: "Estabeleça expectativas realistas sobre o processo:",
          items: [
            "📅 Primeiros 3 dias: Período mais difícil - expecte resistência, irritabilidade e tentativas de negociação",
            "📅 Semana 1: Adaptação gradual - ainda haverá conflitos, mas menos intensos",
            "📅 Semanas 2-3: Estabilização - novos hábitos começam a se formar, menos conflitos",
            "📅 Mês 1: Consolidação - a nova rotina se torna mais natural e aceita",
            "⚡ Recaídas são normais: Não desista se houver retrocessos - faz parte do processo",
            "🎯 Foque no progresso, não na perfeição: Celebre pequenas vitórias diárias",
            "📈 Ajustes são necessários: Esteja preparado para modificar regras conforme a evolução"
          ]
        },
        {
          id: "rules-detailed",
          title: "Estabelecendo Regras Claras e Específicas",
          type: "tips",
          content: "Regras devem ser específicas, mensuráveis e apropriadas para cada idade:",
          items: [
            "🧒 6-9 anos: 'Tablet só após lição de casa, máximo 1 hora, com pausas de 15 minutos a cada 30 minutos'",
            "🧑 10-13 anos: 'Celular liberado das 16h às 19h nos dias de semana, sem limite nos finais de semana (mas sem dormir com ele)'",
            "👤 14-17 anos: 'Uso livre durante o dia, mas celular fica na estação de carregamento após 22h'",
            "🍽️ Refeições: 'Mesa é zona livre de celular para TODA a família - incluindo pais'",
            "😴 Hora de dormir: 'Celulares ficam carregando fora do quarto 1 hora antes de dormir'",
            "📚 Estudos: 'Durante o dever de casa, celular fica em outro cômodo'",
            "🎮 Apps específicos: 'Jogos só após 18h e por no máximo 1 hora'",
            "📋 Contrato familiar: Crie um documento assinado por todos com as regras acordadas"
          ]
        },
        {
          id: "communication-implementation",
          title: "Comunicação Durante a Implementação",
          type: "tips",
          content: "Como se comunicar efetivamente durante a fase de implementação:",
          items: [
            "✅ Frases que funcionam: 'Lembra do nosso combinado?', 'Vamos checar o tempo juntos'",
            "🚫 Evite: 'Já passou da hora', 'Você prometeu', 'Não confio mais em você'",
            "⏰ Avisos antecipados: 'Faltam 15 minutos para guardar o celular'",
            "🎯 Foque no comportamento: 'Quando você guarda o celular no horário, nossa família funciona melhor'",
            "💬 Valide sentimentos: 'Entendo que é difícil parar no meio do jogo, mas precisamos seguir nosso combinado'",
            "🤝 Seja flexível quando necessário: 'Hoje você pode usar mais 10 minutos, mas amanhã voltamos ao normal'",
            "🎉 Reconheça esforços: 'Notei que você guardou o celular sem eu precisar pedir. Isso me deixa orgulhoso(a)'"
          ]
        },
        {
          id: "child-profiles",
          title: "Adaptações por Perfil da Criança",
          type: "tips",
          content: "Cada criança é única - adapte sua abordagem:",
          items: [
            "😠 Criança explosiva: Use técnicas de desescalada, dê tempo para se acalmar antes de aplicar consequências",
            "😢 Criança ansiosa: Implemente mudanças ainda mais graduais, use técnicas de respiração e muito acolhimento",
            "🎭 Criança manipuladora: Mantenha-se firme, não ceda a chantagens, seja consistente com consequências",
            "😴 Criança apática: Use recompensas mais tangíveis inicialmente, celebre cada pequeno progresso",
            "🧠 Criança com TDAH: Regras mais visuais, lembretes constantes, timers e alarmes como apoio",
            "👥 Criança sociável: Inclua amigos nas atividades alternativas, use a pressão social positiva",
            "📚 Criança estudiosa: Mostre como o uso controlado melhora o rendimento acadêmico"
          ]
        },
        {
          id: "tools-detailed",
          title: "Ferramentas de Controle Detalhadas",
          type: "tips",
          content: "Tecnologia a favor do controle consciente:",
          items: [
            "📱 Google Family Link (Android): Controle completo de tempo, apps e localização",
            "🍎 Screen Time (iOS): Limites por categoria, relatórios detalhados, bloqueio durante sono",
            "🚫 AppBlock: Bloqueia apps específicos durante horários determinados",
            "🔵 Circle Home Plus: Controle de toda a rede Wi-Fi da casa",
            "⏰ Modo 'Não Perturbe': Configure automaticamente para horários de estudo e sono",
            "💙 Filtros de luz azul: f.lux, Night Light ou óculos específicos para uso noturno",
            "📊 RescueTime: Monitora automaticamente tempo gasto em cada atividade",
            "🔐 Koala Phone: Transforma smartphone em telefone básico temporariamente"
          ]
        },
        {
          id: "common-obstacles",
          title: "Superando Obstáculos Comuns",
          type: "tips",
          content: "Soluções para os desafios mais frequentes:",
          items: [
            "😡 'Mas todos os meus amigos podem!': 'Cada família tem suas regras. Nosso foco é no que é melhor para você'",
            "😢 'Vocês não me amam!': 'É exatamente porque te amamos que estamos fazendo isso'",
            "🤝 'Só mais 5 minutinhos': 'Entendo, mas nossa regra é clara. Que tal marcarmos um tempo extra para amanhã?'",
            "📚 'Preciso do celular para estudar': 'Vamos separar as funções: celular para lazer, computador para estudos'",
            "😰 'E se acontecer uma emergência?': 'Em emergências reais, você sempre pode nos procurar'",
            "🎮 'Meus amigos estão jogando agora': 'Que tal convidar seus amigos para vir aqui jogar algo offline?'",
            "⏰ 'Não vi as horas passarem': 'Por isso usamos timer - ele vai te ajudar a perceber o tempo'"
          ]
        },
      ]
    },
    {
      id: "stage3",
      title: "Etapa 3: Substituição por Atividades",
      content: `🔄 **O segredo está na substituição inteligente!** Não basta apenas "tirar" o celular - é preciso oferecer alternativas ainda mais atrativas. O cérebro busca dopamina, e nossa missão é direcioná-lo para experiências reais e enriquecedoras que promovam conexão, criatividade e bem-estar físico.

⚡ **Estratégia-chave:** Comece pelas preferências da criança. Uma transição suave gera menos resistência e mais engajamento duradouro.`,
      sections: [
        {
          id: "age-guide",
          title: "🎯 Guia por Faixa Etária",
          type: "tips",
          content: "Adapte as atividades conforme a idade para máximo engajamento:",
          items: [
            "6-9 anos: Foque em brincadeiras lúdicas e exploração sensorial 🎈",
            "10-13 anos: Introduza desafios e atividades em grupo 🏆",
            "14-17 anos: Valorize autonomia e atividades com propósito social 🌟"
          ]
        },
        {
          id: "transition-tips",
          title: "🚀 Transição Gradual",
          type: "tips",
          content: "Como fazer a mudança sem gerar rejeição:",
          items: [
            "Comece com 15-30 minutos de atividade antes do tempo de tela",
            "Use o sistema de 'ganhar tempo extra' através de atividades físicas",
            "Transforme tarefas em desafios divertidos com recompensas",
            "Permita que a criança escolha entre 2-3 atividades pré-selecionadas"
          ]
        },
        {
          id: "outdoor",
          title: "🌿 Brincadeiras ao Ar Livre",
          type: "list",
          content: "Reconecte com a natureza e estimule todos os sentidos:",
          items: [
            "🚴 Andar de bicicleta ou patins - queima energia e desenvolve equilíbrio",
            "⚽ Jogar bola ou soltar pipa - coordenação e diversão em grupo",
            "🌳 Piqueniques no parque - momentos especiais em família",
            "🦋 Explorar a natureza - curiosidade científica natural",
            "🎯 Brincar em playgrounds - socialização e exercício"
          ]
        },
        {
          id: "sports",
          title: "💪 Esportes e Atividades Físicas",
          type: "list",
          content: "Canalize a energia para fortalecer corpo e mente:",
          items: [
            "🏀 Esportes coletivos - trabalho em equipe e disciplina",
            "💃 Aulas de dança - expressão corporal e ritmo",
            "🏊 Natação - exercício completo e relaxante",
            "🥋 Artes marciais - autocontrole e confiança",
            "🧘 Yoga em família - mindfulness e flexibilidade"
          ]
        },
        {
          id: "creative",
          title: "🎨 Artes e Criatividade",
          type: "list",
          content: "Desperte o artista interior e estimule a imaginação:",
          items: [
            "🎨 Pintura e desenho - expressão visual e concentração",
            "✂️ Artesanato e origami - coordenação motora fina",
            "📝 Escrita criativa - desenvolvimento da linguagem",
            "🎵 Música e canto - sensibilidade artística",
            "🎭 Teatro familiar - confiança e comunicação"
          ]
        },
        {
          id: "family",
          title: "👨‍👩‍👧‍👦 Atividades em Família",
          type: "list",
          content: "Fortaleça vínculos através de momentos compartilhados:",
          items: [
            "🎲 Jogos de tabuleiro - estratégia e paciência",
            "👨‍🍳 Cozinhar juntos - vida prática e colaboração",
            "🎬 Noites de cinema - discussões sobre valores",
            "🎤 Karaokê familiar - diversão e desinibição",
            "🎉 Organizar eventos - planejamento e execução"
          ]
        },
        {
          id: "discover-interests",
          title: "🔍 Como Descobrir Interesses",
          type: "tips",
          content: "Identifique rapidamente as preferências naturais:",
          items: [
            "Observe o que mais chamava atenção antes dos dispositivos digitais",
            "Ofereça 'degustação' de 15 minutos em diferentes atividades",
            "Pergunte sobre sonhos e profissões que despertam curiosidade",
            "Note padrões: prefere atividades solo ou em grupo? Físicas ou criativas?"
          ]
        },
        {
          id: "motivation-boost",
          title: "🚀 Turbinando a Motivação",
          type: "tips",
          content: "Estratégias para tornar atividades irresistíveis:",
          items: [
            "Crie 'conquistas' e níveis como nos games (quadro de progressão visual)",
            "Documente momentos especiais em álbum físico ou mural",
            "Convide amigos para participar - poder da influência social",
            "Deixe a criança ensinar você algo novo que aprendeu"
          ]
        }
      ]
    },
    {
      id: "stage4",
      title: "Etapa 4: Reforço Positivo",
      subtitle: "Celebrando cada conquista",
      content: `Celebrar as conquistas, reforçar comportamentos positivos e manter um diálogo aberto para ajustar o processo conforme necessário.`,
      sections: [
        {
          id: "celebrate",
          title: "Como Celebrar Conquistas",
          type: "tips",
          content: "",
          items: [
            "Reconheça cada pequeno progresso",
            "Use recompensas significativas (não digitais)",
            "Elogie comportamentos específicos",
            "Crie certificados de conquista",
            "Organize celebrações especiais"
          ]
        },
        {
          id: "rewards",
          title: "Sistema de Pontos",
          type: "exercise",
          content: `• Reduzir 30 minutos: 1 ponto
• Atividade offline: 2 pontos
• Sem celular nas refeições: 1 ponto/dia
• 10 pontos = Atividade especial em família`
        },
        {
          id: "dialogue",
          title: "Mantendo o Diálogo",
          type: "tips",
          content: "Perguntas para check-ins semanais:",
          items: [
            "Como você está se sentindo com as mudanças?",
            "O que tem sido mais difícil?",
            "Do que você mais gostou essa semana?",
            "Como podemos melhorar juntos?",
            "Que atividade nova podemos tentar?"
          ]
        }
      ]
    },
    {
      id: "conclusion",
      title: "Conclusão",
      subtitle: "Uma nova vida para sua família",
      content: `Ao longo dos anos, vi famílias transformarem suas vidas. Crianças que antes estavam isoladas em um quarto, hoje brincam ao ar livre e interagem com os amigos. Adolescentes que sofriam com ansiedade e baixa autoestima, hoje estão mais confiantes e focados em seus objetivos.

E o mais importante: pais e filhos reconectados, compartilhando momentos de qualidade e fortalecendo seus laços.

Você tem em suas mãos o poder de transformar a vida dos seus filhos. Com paciência, amor e o método certo, vocês podem construir uma relação saudável com a tecnologia e, mais importante, fortalecer os vínculos familiares.

Vamos juntos mudar a vida das suas crianças para melhor!`,
      images: []
    }
  ],
  bonusBooks: [
    {
      id: "mindfulness",
      title: "Atenção Plena em Família",
      description: "Técnicas de mindfulness para praticar com crianças e fortalecer conexões familiares",
      icon: "🧘"
    },
    {
      id: "apps",
      title: "Guia de Apps e Jogos Educacionais",
      description: "Os melhores aplicativos e jogos que realmente educam e desenvolvem habilidades",
      icon: "📱"
    },
    {
      id: "adhd",
      title: "TDAH e Telas",
      description: "Estratégias específicas para crianças com TDAH no mundo digital",
      icon: "🧠"
    }
  ]
};