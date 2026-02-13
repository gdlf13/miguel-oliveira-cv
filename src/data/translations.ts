export type Locale = "pt" | "en";

interface Translation {
  nav: { projects: string; cv: string; contact: string };
  hero: { tagline: string; cvButton: string; projectsButton: string; scroll: string };
  highlights: { title: string; items: string[] };
  projects: {
    title: string;
    subtitle: string;
    viewDemo: string;
    viewDetails: string;
    descriptions: Record<string, string>;
  };
  projectDetail: {
    back: string;
    techStack: string;
    features: string;
    detailedDescriptions: Record<string, string>;
    featureTranslations: Record<string, string[]>;
  };
  categories: Record<string, string>;
  footer: { title: string };
}

export const translations: Record<Locale, Translation> = {
  pt: {
    nav: {
      projects: "Projectos",
      cv: "CV",
      contact: "Contacto",
    },
    hero: {
      tagline: "Psicologia · Data Science · AI Engineering",
      cvButton: "Ver CV (PDF)",
      projectsButton: "Ver Projectos",
      scroll: "Scroll",
    },
    highlights: {
      title: "Destaques",
      items: [
        "Investigação em Psicologia e Ciência de Dados",
        "10+ projectos de IA aplicados a educação e emprego",
        "Experiência em agentes autónomos e chatbots psicoeducacionais",
        "Formação e divulgação de IA para professores",
      ],
    },
    projects: {
      title: "Projectos",
      subtitle:
        "Uma selecção de projectos em educação, agentes de IA, dados e aplicações.",
      viewDemo: "Ver demo",
      viewDetails: "Ver detalhes",
      descriptions: {
        jogaletras: "App interactiva para treino de alfabetização infantil.",
        "ai-fact-checker":
          "Plataforma de verificação automática de factos com IA.",
        amancio:
          "Chatbot psicoeducacional de bem-estar mental baseado em evidência.",
        "interactive-report":
          "Relatórios interactivos com chat IA e gráficos dinâmicos.",
        "linkedin-query":
          "Gerador automático de pesquisas LinkedIn para recrutadores.",
        "radar-vagas":
          "Plataforma de monitorização do mercado de emprego português.",
        "ad-chase": "Agente de scraping de vagas IT de múltiplos portais.",
        "linkedin-rh":
          "Ferramenta de filtragem e busca LinkedIn de recrutadores.",
        "tutor-filosofia":
          "Tutor virtual IA para exames nacionais de Filosofia 11.º ano.",
        mealhada: "Apresentação web interactiva sobre IA na educação.",
      } as Record<string, string>,
    },
    projectDetail: {
      back: "Voltar",
      techStack: "Tecnologias",
      features: "Funcionalidades",
      detailedDescriptions: {
        jogaletras:
          "O JogaLetras é uma aplicação educativa desenhada para apoiar crianças no processo de alfabetização. Através de exercícios interactivos de leitura e escrita, a app adapta-se ao nível de cada criança, oferecendo desafios progressivos e recompensas que mantêm a motivação. A interface foi pensada para ser intuitiva e atractiva para utilizadores jovens, com elementos visuais coloridos e feedback imediato.",
        "ai-fact-checker":
          "O AI Fact Checker é uma plataforma que utiliza inteligência artificial para verificar automaticamente a veracidade de afirmações. O sistema consulta múltiplas fontes fiáveis através de um pipeline RAG (Retrieval-Augmented Generation), classifica cada afirmação com níveis de confiança e gera um relatório detalhado com as fontes citadas. Útil para jornalistas, investigadores e qualquer pessoa que queira validar informação.",
        amancio:
          "O Amâncio é um chatbot psicoeducacional concebido para promover o bem-estar mental de forma acessível e baseada em evidência. Utiliza técnicas cognitivo-comportamentais para dialogar com o utilizador de forma empática, oferecendo conteúdos psicoeducacionais validados cientificamente. Inclui mecanismos de detecção de sinais de crise e encaminhamento seguro, com guardrails éticos que garantem respostas responsáveis.",
        "interactive-report":
          "O Interactive AI Report transforma dados brutos em relatórios visuais e interactivos. O utilizador pode carregar ficheiros de dados e obter automaticamente gráficos dinâmicos, ou explorar os dados através de um chat com IA usando linguagem natural. Suporta vários tipos de visualização — barras, linhas, dispersão e mapas — e permite exportar os relatórios para partilha.",
        "linkedin-query":
          "O LinkedIn Query Generator simplifica a criação de pesquisas booleanas complexas para o LinkedIn. Mesmo sem conhecimento técnico, recrutadores podem construir queries precisas usando templates por sector e função. A ferramenta gera, pré-visualiza e permite copiar rapidamente as queries, optimizando os operadores AND/OR/NOT para máxima relevância nos resultados.",
        "radar-vagas":
          "O Radar de Vagas é uma plataforma que monitoriza automaticamente o mercado de emprego em Portugal. Recolhe vagas de múltiplos portais, permite filtragem por localização, sector e tipo de contrato, e alerta o utilizador quando surgem novas oportunidades que correspondem ao seu perfil. Inclui um dashboard com tendências e estatísticas do mercado laboral.",
        "ad-chase":
          "O Ad Chase Agent é um agente autónomo de scraping que recolhe vagas de emprego IT de vários portais em simultâneo. Opera com ciclos programados de recolha, deduplica inteligentemente as vagas encontradas entre portais diferentes e exporta os resultados de forma estruturada para análise posterior. Desenhado para funcionar de forma contínua e sem intervenção manual.",
        "linkedin-rh":
          "O LinkedIn RH Search é uma ferramenta que permite pesquisar e filtrar perfis de recrutadores no LinkedIn de forma avançada. Com filtros multi-critério por empresa, sector e localização, gera rankings de relevância baseados na correspondência de perfil e permite exportar listas filtradas para contacto directo. Interface intuitiva pensada para profissionais de RH.",
        "tutor-filosofia":
          "O Tutor de Filosofia é um tutor virtual alimentado por IA, alinhado com o programa nacional de Filosofia do 11.º ano. Explica conceitos filosóficos de forma clara, propõe exercícios de exame com correcção automática e feedback detalhado, e conduz diálogos socráticos adaptativos ao nível do aluno. Cobre todos os autores e temas do currículo.",
        mealhada:
          "O Mealhada 2025 é uma apresentação web interactiva criada para uma sessão de formação sobre inteligência artificial na educação. Com animações imersivas e navegação por slides, apresenta aplicações práticas de IA na sala de aula e exemplos interactivos de ferramentas que professores podem usar no seu dia-a-dia. Compatível com desktop e dispositivos móveis.",
      } as Record<string, string>,
      featureTranslations: {} as Record<string, string[]>,
    },
    categories: {
      Educação: "Educação",
      Agentes: "Agentes",
      Dados: "Dados",
      Apps: "Apps",
    } as Record<string, string>,
    footer: {
      title: "Contacto",
    },
  },
  en: {
    nav: {
      projects: "Projects",
      cv: "CV",
      contact: "Contact",
    },
    hero: {
      tagline: "Psychology · Data Science · AI Engineering",
      cvButton: "View CV (PDF)",
      projectsButton: "View Projects",
      scroll: "Scroll",
    },
    highlights: {
      title: "Highlights",
      items: [
        "Research in Psychology and Data Science",
        "10+ AI projects applied to education and employment",
        "Experience in autonomous agents and psychoeducational chatbots",
        "AI training and outreach for teachers",
      ],
    },
    projects: {
      title: "Projects",
      subtitle:
        "A selection of projects in education, AI agents, data and applications.",
      viewDemo: "View demo",
      viewDetails: "View details",
      descriptions: {
        jogaletras:
          "Interactive app for children's literacy training.",
        "ai-fact-checker":
          "Automated fact-checking platform powered by AI.",
        amancio:
          "Psychoeducational chatbot for evidence-based mental well-being.",
        "interactive-report":
          "Interactive reports with AI chat and dynamic charts.",
        "linkedin-query":
          "Automatic LinkedIn search query generator for recruiters.",
        "radar-vagas":
          "Portuguese job market monitoring platform.",
        "ad-chase":
          "IT job scraping agent across multiple portals.",
        "linkedin-rh":
          "LinkedIn recruiter filtering and search tool.",
        "tutor-filosofia":
          "AI virtual tutor for national Philosophy exams (11th grade).",
        mealhada:
          "Interactive web presentation on AI in education.",
      } as Record<string, string>,
    },
    projectDetail: {
      back: "Back",
      techStack: "Tech Stack",
      features: "Features",
      detailedDescriptions: {
        jogaletras:
          "JogaLetras is an educational app designed to support children in the literacy process. Through interactive reading and writing exercises, the app adapts to each child's level, offering progressive challenges and rewards that keep motivation high. The interface is designed to be intuitive and attractive for young users, with colourful visuals and immediate feedback.",
        "ai-fact-checker":
          "AI Fact Checker is a platform that uses artificial intelligence to automatically verify the truthfulness of claims. The system queries multiple reliable sources through a RAG (Retrieval-Augmented Generation) pipeline, classifies each claim with confidence levels, and generates a detailed report with cited sources. Useful for journalists, researchers, and anyone wanting to validate information.",
        amancio:
          "Amâncio is a psychoeducational chatbot designed to promote mental well-being in an accessible, evidence-based way. It uses cognitive-behavioural techniques to dialogue empathetically with users, offering scientifically validated psychoeducational content. It includes crisis signal detection mechanisms and safe referral, with ethical guardrails ensuring responsible responses.",
        "interactive-report":
          "Interactive AI Report transforms raw data into visual, interactive reports. Users can upload data files and automatically get dynamic charts, or explore data through an AI chat using natural language. It supports various visualisation types — bars, lines, scatter, and maps — and allows exporting reports for sharing.",
        "linkedin-query":
          "LinkedIn Query Generator simplifies the creation of complex boolean searches for LinkedIn. Even without technical knowledge, recruiters can build precise queries using templates by sector and role. The tool generates, previews, and allows quick copying of queries, optimising AND/OR/NOT operators for maximum relevance.",
        "radar-vagas":
          "Radar de Vagas is a platform that automatically monitors the Portuguese job market. It collects listings from multiple portals, allows filtering by location, sector, and contract type, and alerts users when new opportunities match their profile. Includes a dashboard with labour market trends and statistics.",
        "ad-chase":
          "Ad Chase Agent is an autonomous scraping agent that collects IT job listings from multiple portals simultaneously. It operates on scheduled collection cycles, intelligently deduplicates listings found across different portals, and exports structured results for further analysis. Designed to run continuously without manual intervention.",
        "linkedin-rh":
          "LinkedIn RH Search is a tool for advanced searching and filtering of recruiter profiles on LinkedIn. With multi-criteria filters by company, sector, and location, it generates relevance rankings based on profile matching and allows exporting filtered lists for direct contact. Intuitive interface designed for HR professionals.",
        "tutor-filosofia":
          "Tutor de Filosofia is an AI-powered virtual tutor aligned with the Portuguese national Philosophy curriculum for 11th grade. It explains philosophical concepts clearly, proposes exam exercises with automatic correction and detailed feedback, and conducts adaptive Socratic dialogues based on the student's level. Covers all authors and topics in the curriculum.",
        mealhada:
          "Mealhada 2025 is an interactive web presentation created for a training session on artificial intelligence in education. With immersive animations and slide navigation, it showcases practical AI applications in the classroom and interactive examples of tools teachers can use daily. Compatible with desktop and mobile devices.",
      } as Record<string, string>,
      featureTranslations: {
        jogaletras: [
          "Adaptive reading and writing exercises",
          "Scoring and reward system to motivate children",
          "Colourful, intuitive interface for young users",
          "Level-based difficulty progression",
        ],
        "ai-fact-checker": [
          "Automatic claim verification against reliable sources",
          "RAG pipeline for knowledge base queries",
          "Truthfulness classification with confidence levels",
          "Explanatory report generation with cited sources",
        ],
        amancio: [
          "Empathetic conversation based on cognitive-behavioural techniques",
          "Scientifically validated psychoeducational content",
          "Crisis signal detection with safe referral",
          "Ethical guardrails for responsible responses",
        ],
        "interactive-report": [
          "Data upload with automatic visualisation generation",
          "AI chat for natural language data exploration",
          "Interactive charts (bar, line, scatter, maps)",
          "Report export in shareable format",
        ],
        "linkedin-query": [
          "Complex boolean query building without technical knowledge",
          "Pre-defined templates by sector and role",
          "Preview and quick copy of generated queries",
          "AND/OR/NOT operator optimisation for maximum precision",
        ],
        "radar-vagas": [
          "Automatic job monitoring across multiple Portuguese portals",
          "Filtering by location, sector, and contract type",
          "Alerts for new matching opportunities",
          "Dashboard with market trends and statistics",
        ],
        "ad-chase": [
          "Orchestrated scraping of multiple job portals simultaneously",
          "Autonomous agent with scheduled collection cycles",
          "Intelligent deduplication across portals",
          "Structured export for further analysis",
        ],
        "linkedin-rh": [
          "Advanced recruiter profile search by company and sector",
          "Multi-criteria filtering with intuitive interface",
          "Relevance ranking based on profile matching",
          "Filtered list export for direct contact",
        ],
        "tutor-filosofia": [
          "Philosophical concept explanations aligned with the national curriculum",
          "Exam exercises with automatic correction and feedback",
          "Adaptive Socratic dialogue at the student's level",
          "Coverage of all 11th-grade authors and topics",
        ],
        mealhada: [
          "Immersive web presentation with animations and transitions",
          "Content on practical AI applications in the classroom",
          "Slide navigation with mobile support",
          "Interactive examples of AI tools for teachers",
        ],
      } as Record<string, string[]>,
    },
    categories: {
      Educação: "Education",
      Agentes: "Agents",
      Dados: "Data",
      Apps: "Apps",
    } as Record<string, string>,
    footer: {
      title: "Contact",
    },
  },
};
