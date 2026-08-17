export type ArticleTheme = "Inteligência Artificial" | "Psicologia & Sociedade" | "Educação" | "Trabalho & Economia" | "Cibersegurança";

export interface Article {
  title: string;
  url: string;
  date: string;
  publication: "Tek Notícias · SAPO Tek" | "Jornal Económico";
  theme: ArticleTheme;
  excerpt: string;
}

export const articles: Article[] = [
  {
    "title": "I Know Kung Fu: como a experiência humana se torna software",
    "url": "https://tek.sapo.pt/opiniao/artigos/i-know-kung-fu-como-a-experiencia-humana-se-torna-software/",
    "date": "2026-08-06",
    "excerpt": "Há uma cena no filme Matrix icónica, quase premonitória. Neo abre os olhos e diz: “I know Kung Fu”. Em segundos, uma competência complexa foi descarregada para a sua mente. Aquilo que antes exigiria anos de treino, repetição e disciplina, surge como uma capacidade/competência imediatamente disponível. Durante muito tempo, esta ideia pertenceu ao território da ficção científica. Hoje, começa a aproximar-se da forma como trabalhamos com Inteligência Artificial (IA). Não porque a IA nos transfira conhecimento diretamente para o cérebro, mas porque permite encapsular formas de trabalhar em unidades reutilizáveis. A isto começamos a chamar skills . Uma skill é, de forma simples, uma competência",
    "publication": "Tek Notícias · SAPO Tek",
    "theme": "Inteligência Artificial"
  },
  {
    "title": "A competência invisível dos próximos 24 meses: saber delegar a agentes de IA",
    "url": "https://tek.sapo.pt/opiniao/artigos/a-competencia-invisivel-dos-proximos-24-meses-saber-delegar-a-agentes-de-ia/",
    "date": "2026-06-11",
    "excerpt": "Começamos a assistir a uma mudança silenciosa, mas profundamente estrutural, na forma como trabalhamos. Durante décadas, o valor profissional esteve associado à capacidade de fazer: executar tarefas, dominar técnicas, acumular conhecimento e aperfeiçoar processos. Esse modelo não desapareceu, mas começa a revelar as suas limitações num contexto onde a tecnologia deixa de ser apenas uma ferramenta e passa a assumir um papel mais ativo na execução. A questão já não é apenas “o que sabemos fazer”, mas “como estruturamos aquilo que queremos que seja feito”. Nos últimos anos, habituámo-nos a interagir com sistemas de IA que respondiam. Fazíamos perguntas, recebíamos respostas, e o ciclo terminav",
    "publication": "Tek Notícias · SAPO Tek",
    "theme": "Inteligência Artificial"
  },
  {
    "title": "A escola está a otimizar para competências obsoletas (Parte 2): Que incentivos criam valor humano na era da IA?",
    "url": "https://tek.sapo.pt/opiniao/artigos/a-escola-esta-a-otimizar-para-competencias-obsoletas-parte-2-que-incentivos-criam-valor-humano-na-era-da-ia/",
    "date": "2026-03-31",
    "excerpt": "No artigo anterior defendi que a escola está a optimizar para competências prestes a perder valor distintivo: rapidez cognitiva, retenção e produção de respostas. Terminei com a promessa de abordar neste artigo os incentivos do sistema educativo. Esta segunda parte é sobre essa peça invisível e decisiva. Se continuarmos a premiar eficiência, eficácia, diminuição do tempo e diminuição do custo, estaremos a alinhar a educação com o eixo onde a IA é, por definição, imbatível. É o equivalente institucional de treinar corredores para competir com motores: por mais disciplina e mérito que existam, a comparação está mal desenhada. E quando as métricas recompensam a execução, o humano não só perde,",
    "publication": "Tek Notícias · SAPO Tek",
    "theme": "Educação"
  },
  {
    "title": "A Escola está a otimizar para competências obsoletas",
    "url": "https://tek.sapo.pt/opiniao/artigos/a-escola-esta-a-otimizar-para-competencias-obsoletas/",
    "date": "2026-01-22",
    "excerpt": "Durante mais de um século, a escola preparou os alunos para dominar competências cognitivas que eram bens raros: memorizar, reter informação, organizar conteúdos e produzir respostas rápidas. Este modelo fazia sentido num mundo em que a inteligência humana era o único motor de processamento avançado, algo escasso e muito valioso. Mas, ao ritmo acelerado a que assistimos ao aumento da inteligência artificial (IA), torna-se previsível que , dentro da próxima década , estas competências deixem de ter valor distintivo e passem a ser desempenhadas de forma incomparavelmente superior por sistemas de IA. E aqui surge o ponto crítico: se esta trajetória (marcada por um aumento exponencial da inteli",
    "publication": "Tek Notícias · SAPO Tek",
    "theme": "Educação"
  },
  {
    "title": "Porque os benchmarks da IA devem medir o que nos torna humanos",
    "url": "https://tek.sapo.pt/opiniao/artigos/porque-os-benchmarks-da-ia-devem-medir-o-que-nos-torna-humanos/",
    "date": "2025-11-10",
    "excerpt": "Durante décadas, avaliámos o progresso da inteligência artificial com métricas técnicas — precisão, velocidade, capacidade de processamento. Mas se queremos que a IA se alinhe com os valores humanos, temos de mudar a forma como a avaliamos. U m benchmark é, de forma simples, um teste de comparação . Tal como um exame mede o conhecimento de um aluno, um benchmark mede o desempenho de uma máquina. São conjuntos de tarefas padronizadas, como resolver problemas de matemática, traduzir textos, responder a perguntas, que permitem comparar diferentes modelos de IA entre si. Um modelo “melhor” é aquele que acerta em mais perguntas, produz respostas mais rápidas ou demonstra maior coerência. Estes t",
    "publication": "Tek Notícias · SAPO Tek",
    "theme": "Psicologia & Sociedade"
  },
  {
    "title": "Produtividade aumentada ou défice digital?",
    "url": "https://tek.sapo.pt/opiniao/artigos/produtividade-aumentada-ou-defice-digital/",
    "date": "2025-09-22",
    "excerpt": "Durante séculos, medir produtividade era quase sempre somar duas coisas: as pessoas que trabalhavam e os recursos que tinham à sua disposição . Contavam-se horas de esforço humano e avaliava-se o capital físico, e era daí que se explicava o valor produzido. Esse modelo já não chega. A inteligência artificial trouxe um terceiro fator que é invisível, mas decisivo: o poder computacional disponível por cada trabalhador . Até há poucos anos, falar de capital era falar em fábricas ou escritórios. Hoje mede-se também em horas de GPUs e acesso a modelos de linguagem (IA). Dois profissionais com a mesma formação podem entregar resultados radicalmente diferentes se apenas um tiver acesso a ferrament",
    "publication": "Tek Notícias · SAPO Tek",
    "theme": "Psicologia & Sociedade"
  },
  {
    "title": "Quando os algoritmos deixam de pedir licença",
    "url": "https://tek.sapo.pt/opiniao/artigos/quando-os-algoritmos-deixam-de-pedir-licenca/",
    "date": "2025-08-27",
    "excerpt": "A maioria de nós habituou-se a falar com “assistentes” digitais ( chatbots ) que fazem o que pedimos e depois aguardam novas ordens. Esse modelo está a ficar em final de ciclo. A próxima geração de inteligência artificial será composta por agentes : sistemas capazes de interpretar um objetivo amplo, planear vários passos e executá-los de forma autónoma, pedindo ajuda apenas quando encontram um impasse. Além dessa autonomia “intelectual”, destacam-se pelo arsenal de ferramentas a que recorrem: ligam-se à internet para obter nova informação, navegam por sites como qualquer utilizador e até podem autorizar pagamentos ou contratar serviços em nosso nome. O que muda não é a quantidade de intelig",
    "publication": "Tek Notícias · SAPO Tek",
    "theme": "Inteligência Artificial"
  },
  {
    "title": "Agentes invisíveis, mudanças reais",
    "url": "https://tek.sapo.pt/opiniao/artigos/agentes-invisiveis-mudancas-reais/",
    "date": "2025-07-22",
    "excerpt": "Estamos prestes a entrar numa nova fase da revolução digital. Se 2023 foi o ano em que todos falaram da inteligência artificial, 2025 será o ano dos agentes. Não é apenas mais uma tendência — é o início de uma mudança profunda na forma como o trabalho será organizado e executado. Mas o que são, afinal, estes agentes? São formas avançadas de inteligência artificial que combinam compreensão, planeamento e ação. Diferem dos chatbots tradicionais porque não se limitam a responder, usam ferramentas (tools), tomam decisões e executam tarefas de forma autónoma . Já existem agentes capazes de trabalhar durante horas seguidas sem intervenção humana, completando cadeias de tarefas complexas que podem",
    "publication": "Tek Notícias · SAPO Tek",
    "theme": "Trabalho & Economia"
  },
  {
    "title": "O leitor invisível: Quando as “máquinas” tomam conta do texto",
    "url": "https://tek.sapo.pt/opiniao/artigos/o-leitor-invisivel-quando-as-maquinas-tomam-conta-do-texto/",
    "date": "2025-05-05",
    "excerpt": "Em 2025, continuamos a criar textos como se fossem sempre lidos por pessoas. Olhamos para manuais, sites institucionais ou páginas da internet e vemos conteúdos pensados para humanos: linguagem clara, frases explicadas passo a passo, até algumas imagens para ajudar. Mas há uma mudança a acontecer. Cada vez mais, quem “lê” estes conteúdos não são pessoas — são modelos de inteligência artificial, como o ChatGPT, Gemini, Claude ou o Grok. Estes sistemas leem tudo. Leem mais rápido, comparam mais fontes e processam muito mais informação do que qualquer ser humano. Mas não precisam que o texto seja “bonito” ou empático. Não precisam de explicações longas, exemplos ou imagens. O que preferem são",
    "publication": "Tek Notícias · SAPO Tek",
    "theme": "Psicologia & Sociedade"
  },
  {
    "title": "A Inteligência Artificial como a nova matéria-prima do século XXI",
    "url": "https://tek.sapo.pt/opiniao/artigos/a-inteligencia-artificial-como-a-nova-materia-prima-do-seculo-xxi/",
    "date": "2025-03-25",
    "excerpt": "Desde as origens da civilização, certas matérias-primas definiram o poder económico e a soberania das nações. O ouro moldou impérios, o petróleo alimentou revoluções industriais e a eletricidade impulsionou o desenvolvimento tecnológico do século XX. Agora, na era digital, a Inteligência Artificial (IA) surge como o recurso essencial que determinará o futuro das nações. A Europa, historicamente pioneira em inovação científica, enfrenta um momento crítico: precisa reconhecer a IA como um bem estratégico e posicionar-se de forma autónoma nesta nova revolução industrial. Mais do que um avanço tecnológico, a IA deve ser vista como uma matéria-prima, a infraestrutura fundamental sobre a qual se",
    "publication": "Tek Notícias · SAPO Tek",
    "theme": "Inteligência Artificial"
  },
  {
    "title": "Quando perguntar se torna a melhor resposta: um futuro para a educação na era da Inteligência Artificial",
    "url": "https://tek.sapo.pt/opiniao/artigos/quando-perguntar-se-torna-a-melhor-resposta-um-futuro-para-a-educacao-na-era-da-inteligencia-artificial/",
    "date": "2025-02-28",
    "excerpt": "Vivemos na era da informação instantânea. Qualquer dúvida pode ser respondida em segundos por motores de busca ou assistentes de inteligência artificial, mas paradoxalmente, nunca foi tão fundamental cultivar a arte de fazer perguntas. Se até aqui o valor estava em quem detinha as respostas, hoje ele reside em quem sabe questionar. Esta transformação de paradigma não é meramente uma questão filosófica—ela possui repercussões significativas na forma como iremos ensinar e adquirir conhecimento daqui para frente. Durante séculos, o ensino foi estruturado em torno da transmissão de respostas. Professores detinham o conhecimento e os alunos eram treinados para absorvê-lo e reproduzi-lo. Os exame",
    "publication": "Tek Notícias · SAPO Tek",
    "theme": "Educação"
  },
  {
    "title": "A fragilidade dos vieses cognitivos humanos na era da Inteligência Artificial",
    "url": "https://tek.sapo.pt/opiniao/artigos/a-fragilidade-dos-vieses-cognitivos-humanos-na-era-da-inteligencia-artificial/",
    "date": "2025-01-28",
    "excerpt": "A evolução rápida da Inteligência Artificial (IA) trouxe à tona questões que vão além da tecnologia em si, revelando as limitações humanas na forma como criamos, compreendemos e prevemos o impacto dessas tecnologias. Dados recentes, apresentados num estudo que comparou previsões de investigadores em 2022 e 2023, indicam que as expectativas para avanços tecnológicos significativos na IA foram ajustadas em até 48 anos, ilustrando o impacto dos vieses cognitivos na forma como interpretamos e projetamos informações sobre o futuro. Este artigo tenta examinar como tais vieses influenciam as nossas decisões e previsões tecnológicas, com implicações significativas para o futuro da IA e da sociedade",
    "publication": "Tek Notícias · SAPO Tek",
    "theme": "Psicologia & Sociedade"
  },
  {
    "title": "A Inteligência Artificial, os telemóveis nas escolas e a saúde mental: como será em 2025?",
    "url": "https://tek.sapo.pt/opiniao/artigos/a-inteligencia-artificial-os-telemoveis-nas-escolas-e-a-saude-mental-como-sera-em-2025/",
    "date": "2024-12-31",
    "excerpt": "O ano de 2024 foi marcado por avanços significativos na Inteligência Artificial (AI), transformando não apenas a forma como interagimos com a tecnologia, mas também levantando questões fundamentais sobre ética, supervisão e autonomia das “máquinas”. A ideia da IA de se tornar ferramenta complementar para ser agente autónomo redefiniu o papel destas tecnologias, desencadeando debates sobre agência, fiabilidade e delegação de competências. A democratização dos modelos de linguagem de grande escala (LLMs) consolidou o seu lugar como ferramenta central em processos, não só de análise, mas também no processo de tomada de decisão. Estes modelos não só simplificaram tarefas, como também começaram",
    "publication": "Tek Notícias · SAPO Tek",
    "theme": "Educação"
  },
  {
    "title": "Opinião: Será a Psicologia a base do próximo código na Inteligência Artificial?",
    "url": "https://tek.sapo.pt/opiniao/artigos/opiniao-sera-a-psicologia-a-base-do-proximo-codigo-na-inteligencia-artificial/",
    "date": "2024-11-14",
    "excerpt": "A interação entre humanos e máquinas está a tornar-se mais íntima, adaptativa e, paradoxalmente, mais humana. A Psicologia poderá tornar-se uma nova linguagem de programação.",
    "publication": "Tek Notícias · SAPO Tek",
    "theme": "Psicologia & Sociedade"
  },
  {
    "title": "Opinião: Como a engenharia de prompts poderia ter salvo os astronautas em \"2001: Uma Odisseia no Espaço\"",
    "url": "https://tek.sapo.pt/opiniao/artigos/opiniao-como-a-engenharia-de-prompts-poderia-ter-salvo-os-astronautas-em-2001-uma-odisseia-no-espaco/",
    "date": "2024-09-18",
    "excerpt": "Em “2001: Uma Odisseia no Espaço”, os astronautas enfrentam uma situação crítica com o computador HAL 9000, que “avaria” e põe em risco a missão e as suas vidas. A engenharia de prompt , uma técnica usada na inteligência artificial, poderia ter fornecido uma solução para prevenir ou mitigar a crise. Eis como, com exemplos de prompts emocionais baseados no estudo “Large Language Models Understand and Can Be Enhanced by Emotional Stimuli “. Um prompt emocional é um comando/instrução dado a um modelo de linguagem que inclui elementos que evocam respostas emocionais. Em vez de apenas pedir que um modelo execute uma tarefa, um prompt emocional adiciona uma camada que aumenta a urgência ou a impo",
    "publication": "Tek Notícias · SAPO Tek",
    "theme": "Inteligência Artificial"
  },
  {
    "title": "Opinião: IA Concentrada - O Desafio da Academia Face à “Big Tech”",
    "url": "https://tek.sapo.pt/opiniao/artigos/opiniao-ia-concentrada-o-desafio-da-academia-face-a-big-tech/",
    "date": "2024-08-02",
    "excerpt": "É fundamental dar mais recursos ao setor público e à academia para que continuem a desempenhar um papel essencial no desenvolvimento da Inteligência Artificial.",
    "publication": "Tek Notícias · SAPO Tek",
    "theme": "Inteligência Artificial"
  },
  {
    "title": "Opinião: Do Suporte à Soberania - Uma Revolução na Autonomia Digital?",
    "url": "https://tek.sapo.pt/opiniao/artigos/opiniao-do-suporte-a-soberania-uma-revolucao-na-autonomia-digital/",
    "date": "2024-05-27",
    "excerpt": "Começamos a testemunhar o aparecimento de uma nova fronteira na inteligência artificial (IA). Inicialmente, a IA trouxe-nos assistentes digitais capazes de realizar comandos simples e tarefas básicas. Hoje, observamos a manifestação de uma evolução significativa desta tecnologia. Imaginem programas de computador que não apenas seguem instruções, mas que também tomam decisões e operam de forma independente, sem precisar de orientação constante dos humanos. Estes sistemas avançados, conhecidos como agentes virtuais autónomos (agentes sintéticos), representam a nova fronteira da inteligência artificial, marcando a transição para uma era onde a autonomia tecnológica se vislumbra como uma realid",
    "publication": "Tek Notícias · SAPO Tek",
    "theme": "Psicologia & Sociedade"
  },
  {
    "title": "Opinião: Doomers, Luditas e Otimistas: as novas tribos da IA",
    "url": "https://tek.sapo.pt/opiniao/artigos/opiniao-doomers-luditas-e-otimistas-as-novas-tribos-da-ia/",
    "date": "2024-04-26",
    "excerpt": "",
    "publication": "Tek Notícias · SAPO Tek",
    "theme": "Inteligência Artificial"
  },
  {
    "title": "Opinião: Reflexos Digitais - Como as Perguntas Moldam as Respostas dos LLM’s",
    "url": "https://tek.sapo.pt/opiniao/artigos/opiniao-reflexos-digitais-como-as-perguntas-moldam-as-respostas-dos-llms/",
    "date": "2024-03-26",
    "excerpt": "À medida que entramos na era dos Grandes Modelos de Linguagem (LLMs), como o GPT-4, testemunhamos uma transformação paradigmática não apenas no âmbito da capacidade de fornecer respostas, mas também na arte de formular perguntas. Este fenómeno redefinirá o futuro da aprendizagem, da investigação e da criatividade, incumbindo-nos da tarefa de refinar as nossas perguntas para explorar de forma eficaz o vasto mar de informações disponíveis. O êxito na aquisição de conhecimento e na solução de problemas está frequentemente interligado com a capacidade de encontrar respostas. Contudo, com a ascensão dos LLMs, a ênfase migra para a aptidão de fazer as perguntas certas. Esta mudança reflete uma ev",
    "publication": "Tek Notícias · SAPO Tek",
    "theme": "Inteligência Artificial"
  },
  {
    "title": "Opinião: Transformando a Educação - Como Pode a IA Superar o Problema dos 2 Sigmas de Bloom",
    "url": "https://tek.sapo.pt/opiniao/artigos/opiniao-transformando-a-educacao-como-pode-a-ia-superar-o-problema-dos-2-sigmas-de-bloom/",
    "date": "2024-02-16",
    "excerpt": "Em 2024 a escola continua com um “ modus operandi ” que deriva da 1ª Revolução Industrial. Um ensino para as massas, baseado na repetição e na memorização, com poucas oportunidades de diferenciação e personalização, num apanágio “ one size fits all ”, caracterizada pelo chavão “Uma metodologia do século XIX, professores do século XX e alunos do século XXI”. Benjamin Bloom, no seu icónico “The 2 Sigma Problem: The Search For Methods of Group Instruction as Effective as One-to-One Tutoring” , identificou uma lacuna significativa nos sistemas de educação: alunos que recebem tutoria individualizada superam os que seguem o ensino convencional por uma margem de dois desvios padrão. Este fenómeno",
    "publication": "Tek Notícias · SAPO Tek",
    "theme": "Educação"
  },
  {
    "title": "AGI: o despertar de uma Nova Inteligência no horizonte digital",
    "url": "https://jornaleconomico.sapo.pt/noticias/agi-o-despertar-de-uma-nova-inteligencia-no-horizonte-digital/",
    "date": "2023-12-20",
    "excerpt": "As escolhas que fazemos hoje irão definir se a Inteligência Geral Artificial (AGI) servirá como um motor de progresso humano ou se será um marco tecnológico que nos apresenta desafios para os quais ainda podemos não estar preparados.",
    "publication": "Jornal Económico",
    "theme": "Psicologia & Sociedade"
  },
  {
    "title": "As estratégias de persuasão na era da Inteligência Artificial",
    "url": "https://jornaleconomico.sapo.pt/noticias/as-estrategias-de-persuasao-na-era-da-inteligencia-artificial/",
    "date": "2023-11-14",
    "excerpt": "Estaremos à altura de criar e manter o equilíbrio necessário para garantir que a super-persuasão da IA seja uma força para o bem coletivo e não uma ferramenta para a ampliação das fissuras já existentes?",
    "publication": "Jornal Económico",
    "theme": "Inteligência Artificial"
  },
  {
    "title": "A Inteligência como nova forma de capital",
    "url": "https://jornaleconomico.sapo.pt/noticias/a-inteligencia-como-nova-forma-de-capital/",
    "date": "2023-10-16",
    "excerpt": "À medida que a inteligência artificial redefine as regras do jogo, a questão não é se iremos participar, mas como garantir que todos podem participar.",
    "publication": "Jornal Económico",
    "theme": "Trabalho & Economia"
  },
  {
    "title": "Espelho meu, espelho meu, há alguém mais autocentrado do que eu?",
    "url": "https://jornaleconomico.sapo.pt/noticias/espelho-meu-espelho-meu-ha-alguem-mais-autocentrado-do-que-eu/",
    "date": "2023-09-13",
    "excerpt": "A falta de empatia, a construção de câmaras de eco/bolhas e a negligência de perspetivas diversas contribuem para uma sociedade cada vez mais fragmentada e polarizada.",
    "publication": "Jornal Económico",
    "theme": "Psicologia & Sociedade"
  },
  {
    "title": "'Dark Star' e a ética das armas autónomas, uma jornada de reflexão",
    "url": "https://jornaleconomico.sapo.pt/noticias/dark-star-e-a-etica-das-armas-autonomas-uma-jornada-de-reflexao/",
    "date": "2023-08-15",
    "excerpt": "É inegável que a inteligência artificial tem o potencial para beneficiar enormemente a humanidade. O desafio reside em como colher esses benefícios minimizando os riscos e como usar a tecnologia de forma ética e responsável.",
    "publication": "Jornal Económico",
    "theme": "Inteligência Artificial"
  },
  {
    "title": "A era da Programação Conversacional",
    "url": "https://jornaleconomico.sapo.pt/noticias/a-era-da-programacao-conversacional/",
    "date": "2023-07-17",
    "excerpt": "A literacia digital e a capacidade de programar são cada vez mais essenciais na nossa economia digital, e aqueles que são excluídos desta realidade correm o risco de marginalização crescente.",
    "publication": "Jornal Económico",
    "theme": "Trabalho & Economia"
  },
  {
    "title": "O tempo é o luxo supremo",
    "url": "https://jornaleconomico.sapo.pt/noticias/o-tempo-e-o-luxo-supremo/",
    "date": "2023-06-19",
    "excerpt": "Devemo-nos lembrar que o tempo é um recurso limitado e precioso e devemos usá-lo cautelosamente, com sabedoria e propósito.",
    "publication": "Jornal Económico",
    "theme": "Trabalho & Economia"
  },
  {
    "title": "Sejam(os) simpáticos!",
    "url": "https://jornaleconomico.sapo.pt/noticias/sejamos-simpaticos/",
    "date": "2023-05-15",
    "excerpt": "Seja(mos) uma voz de inclusão e flexibilidade e ajudemos a criar um futuro onde a tecnologia seja um reflexo das nossas melhores qualidades, em vez de perpetuar os nossos piores comportamentos.",
    "publication": "Jornal Económico",
    "theme": "Psicologia & Sociedade"
  },
  {
    "title": "O papel crucial da Psicologia na Inteligência Artificial",
    "url": "https://jornaleconomico.sapo.pt/noticias/o-papel-crucial-da-psicologia-na-inteligencia-artificial/",
    "date": "2023-04-12",
    "excerpt": "À medida que os sistemas baseados em IA evoluem e se tornam mais prevalentes e autónomos, é necessário codificar os incentivos e valores que, enquanto sociedade, pretendemos ver refletidos neste novo tipo de tecnologia. Os psicólogos têm aqui um papel importante a desempenhar.",
    "publication": "Jornal Económico",
    "theme": "Psicologia & Sociedade"
  },
  {
    "title": "Como proteger consumidores de um mercado de aplicações digitais de saúde mental desregulado",
    "url": "https://jornaleconomico.sapo.pt/noticias/como-proteger-consumidores-de-um-mercado-de-aplicacoes-digitais-de-saude-mental-desregulado/",
    "date": "2023-03-16",
    "excerpt": "O surgimento exponencial de aplicações digitais em saúde não tem sido acompanhado pelo correspondente desenvolvimento de instrumentos de avaliação de qualidade, podendo colocar em risco a sua utilidade.",
    "publication": "Jornal Económico",
    "theme": "Psicologia & Sociedade"
  },
  {
    "title": "Os desafios da tomada de decisão na era dos Grandes Dados",
    "url": "https://jornaleconomico.sapo.pt/noticias/os-desafios-da-tomada-de-decisao-na-era-dos-grandes-dados/",
    "date": "2023-01-23",
    "excerpt": "É importante referir que ter mais dados não significa, necessariamente, uma melhor tomada de decisão, já que a qualidade dos dados é mais importante do que a quantidade.",
    "publication": "Jornal Económico",
    "theme": "Inteligência Artificial"
  },
  {
    "title": "Só sou responsável por 50% deste artigo...",
    "url": "https://jornaleconomico.sapo.pt/noticias/so-sou-responsavel-por-50-deste-artigo/",
    "date": "2022-12-22",
    "excerpt": "Os outros 50% são da lavra de um 'chatbot'. Passada a estupefação, dou por mim a pensar que alguns dos impactos deste tipo de ferramentas são já previsíveis e terão consequências na forma como produzimos conhecimento. Resta saber quais serão aqueles que ainda não antecipamos.",
    "publication": "Jornal Económico",
    "theme": "Inteligência Artificial"
  },
  {
    "title": "O preço da autonomia digital nos jovens",
    "url": "https://jornaleconomico.sapo.pt/noticias/o-preco-da-autonomia-digital-nos-jovens/",
    "date": "2022-11-24",
    "excerpt": "A amplitude que os jovens têm em chegar a todo o lado está a torná-los demasiado expostos e a superconfiança que percecionam ter faz com que não tomem as básicas medidas de proteção no contexto digital, tornando-os mais vulneráveis a burlas.",
    "publication": "Jornal Económico",
    "theme": "Inteligência Artificial"
  },
  {
    "title": "Os 6 D’s da economia digital",
    "url": "https://jornaleconomico.sapo.pt/noticias/os-6-ds-da-economia-digital/",
    "date": "2022-11-08",
    "excerpt": "Os 6 D's são uma reação em cadeia de progressão tecnológica, um mapa para o rápido desenvolvimento que leva a enormes reviravoltas e oportunidades e que, num contexto de crescimento tecnológico, é exponencial. Pessoas e organizações tentam acompanhar o ritmo.",
    "publication": "Jornal Económico",
    "theme": "Trabalho & Economia"
  },
  {
    "title": "Empatia e negócio",
    "url": "https://jornaleconomico.sapo.pt/noticias/empatia-e-negocio/",
    "date": "2022-10-06",
    "excerpt": "Existe a ideia que num mundo altamente tecnológico todos temos de desenvolver, principalmente, competências das áreas das tecnologias, como forma de nos tornarmos mais competitivos.",
    "publication": "Jornal Económico",
    "theme": "Psicologia & Sociedade"
  },
  {
    "title": "A dimensão económica da cibersegurança",
    "url": "https://jornaleconomico.sapo.pt/noticias/a-dimensao-economica-da-ciberseguranca/",
    "date": "2022-08-30",
    "excerpt": "O investimento nas pessoas, para que possam ser também elas agentes ativos na proteção do valor criado, a fim de mitigar os riscos associados à cibersegurança, é uma mais-valia para a economia.",
    "publication": "Jornal Económico",
    "theme": "Cibersegurança"
  },
  {
    "title": "Um trabalho a tempo inteiro",
    "url": "https://jornaleconomico.sapo.pt/noticias/um-trabalho-a-tempo-inteiro/",
    "date": "2022-08-03",
    "excerpt": "A aposta em cuidados de saúde psicológica é uma aposta nas pessoas, em pessoas mais capazes e com recursos disponíveis para fazer frente a períodos mais desafiantes, mas é também uma aposta de crescimento económico.",
    "publication": "Jornal Económico",
    "theme": "Psicologia & Sociedade"
  },
  {
    "title": "Um novo tipo de relação",
    "url": "https://jornaleconomico.sapo.pt/noticias/um-novo-tipo-de-relacao/",
    "date": "2022-07-06",
    "excerpt": "Importa perceber se os avanços tecnológicos não nos colocarão um novo tipo de relação. Uma relação entre homem-máquina, colocando a tónica num novo leque de competências sociais e relacionais.",
    "publication": "Jornal Económico",
    "theme": "Inteligência Artificial"
  },
  {
    "title": "‘Mind the Gap’, as lacunas globais nas competências digitais",
    "url": "https://jornaleconomico.sapo.pt/noticias/mind-the-gap-as-lacunas-globais-nas-competencias-digitais/",
    "date": "2022-06-07",
    "excerpt": "Além de uma maior consciencialização da importância das denominadas 'soft skills', vistas como facilitadoras no processo de transição digital, existe a crescente noção que um fosso de competências digitais tem associado um custo económico elevado.",
    "publication": "Jornal Económico",
    "theme": "Inteligência Artificial"
  },
  {
    "title": "A urgência do agora",
    "url": "https://jornaleconomico.sapo.pt/noticias/a-urgencia-do-agora/",
    "date": "2022-05-11",
    "excerpt": "Se a tecnologia se quer para servir as pessoas, deve ser feita e liderada por pessoas, então temos de a construir para as pessoas. Ou seja, fazendo o processo de adaptação da tecnologia às pessoas e não o contrário.",
    "publication": "Jornal Económico",
    "theme": "Inteligência Artificial"
  },
  {
    "title": "Resiliência económica",
    "url": "https://jornaleconomico.sapo.pt/noticias/resiliencia-economica/",
    "date": "2022-04-11",
    "excerpt": "O impacto que a economia tem nas nossas vidas é inegável, com o poder de modelar estados de espírito, perceções de futuro e avaliação de bens e produtos. Urge zelar pela sua resiliência.",
    "publication": "Jornal Económico",
    "theme": "Trabalho & Economia"
  },
  {
    "title": "O valor das expectativas",
    "url": "https://jornaleconomico.sapo.pt/noticias/o-valor-das-expectativas-863639/",
    "date": "2022-03-17",
    "excerpt": "Então qual é o valor das expectativas? A resposta é depende. Depende de onde as colocamos, que fatores comparamos, que interpretação fazemos quando as avaliamos.",
    "publication": "Jornal Económico",
    "theme": "Inteligência Artificial"
  },
  {
    "title": "O futuro das lideranças é multimodal",
    "url": "https://jornaleconomico.sapo.pt/noticias/o-futuro-das-liderancas-e-multimodal-845294/",
    "date": "2022-02-10",
    "excerpt": "As exigências de rápidas mudanças nos estilos de vida e rotinas dos colaboradores requerem que existam mecanismos que promovam a saúde psicológica de quem tem de alterar processos, rotinas e competências para fazer face à mudança.",
    "publication": "Jornal Económico",
    "theme": "Psicologia & Sociedade"
  },
  {
    "title": "A mercantilização do cibercrime",
    "url": "https://jornaleconomico.sapo.pt/noticias/a-mercantilizacao-do-cibercrime-830704/",
    "date": "2022-01-13",
    "excerpt": "Como refere o Fórum Económico Mundial, para combater o cibercrime é necessário compreender a sua economia, sendo essencial entender as relações, conexões e comportamentos envolvidos.",
    "publication": "Jornal Económico",
    "theme": "Cibersegurança"
  }
];
