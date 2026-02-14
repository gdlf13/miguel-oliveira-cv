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
        "tutor-filosofia":
          "Tutor virtual IA para exames nacionais de Filosofia 11.º ano.",
        "oasis-social-simulation":
          "Simulador de redes sociais com agentes LLM à escala de um milhão.",
        "verbi-carl-rogers":
          "Assistente de voz com fine-tuning de LLM para simular Carl Rogers.",
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
        "tutor-filosofia":
          "O Tutor de Filosofia é um tutor virtual alimentado por IA, alinhado com o programa nacional de Filosofia do 11.º ano. Explica conceitos filosóficos de forma clara, propõe exercícios de exame com correcção automática e feedback detalhado, e conduz diálogos socráticos adaptativos ao nível do aluno. Cobre todos os autores e temas do currículo.",
        "oasis-social-simulation":
          "O OASIS é um simulador de redes sociais escalável e open-source que integra modelos de linguagem (LLM) com agentes baseados em regras para replicar realisticamente o comportamento de até um milhão de utilizadores em plataformas como Twitter e Reddit. Permite estudar fenómenos sociais complexos como disseminação de informação, polarização de grupos e comportamento de manada.",
        "verbi-carl-rogers":
          "O Verbi — Carl Rogers é um assistente de voz que utiliza fine-tuning de um modelo de linguagem para simular o estilo terapêutico de Carl Rogers. O objectivo central do projecto é explorar as potencialidades e os limites da técnica de fine-tuning aplicada à replicação de estilos comunicacionais específicos. A arquitectura é modular, com componentes independentes de transcrição, geração de resposta e text-to-speech, integrados com múltiplas APIs (OpenAI, Groq, Deepgram).",
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
        "tutor-filosofia":
          "AI virtual tutor for national Philosophy exams (11th grade).",
        "oasis-social-simulation":
          "Social media simulator with LLM agents at one-million scale.",
        "verbi-carl-rogers":
          "Voice assistant with LLM fine-tuning to simulate Carl Rogers.",
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
        "tutor-filosofia":
          "Tutor de Filosofia is an AI-powered virtual tutor aligned with the Portuguese national Philosophy curriculum for 11th grade. It explains philosophical concepts clearly, proposes exam exercises with automatic correction and detailed feedback, and conducts adaptive Socratic dialogues based on the student's level. Covers all authors and topics in the curriculum.",
        "oasis-social-simulation":
          "OASIS is a scalable, open-source social media simulator that integrates large language models with rule-based agents to realistically mimic the behaviour of up to one million users on platforms like Twitter and Reddit. It enables the study of complex social phenomena such as information spread, group polarisation, and herd behaviour.",
        "verbi-carl-rogers":
          "Verbi — Carl Rogers is a voice assistant that uses fine-tuning of a language model to simulate Carl Rogers' therapeutic style. The project's core goal is to explore the potential and limitations of the fine-tuning technique when applied to replicating specific communication styles. The architecture is modular, with independent components for transcription, response generation, and text-to-speech, integrated with multiple APIs (OpenAI, Groq, Deepgram).",
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
        "tutor-filosofia": [
          "Philosophical concept explanations aligned with the national curriculum",
          "Exam exercises with automatic correction and feedback",
          "Adaptive Socratic dialogue at the student's level",
          "Coverage of all 11th-grade authors and topics",
        ],
        "oasis-social-simulation": [
          "Scalable simulation of up to one million autonomous agents",
          "Dynamic environments replicating Twitter and Reddit",
          "21 distinct actions: follow, comment, repost, and more",
          "Integrated recommendation systems by interest and popularity",
        ],
        "verbi-carl-rogers": [
          "LLM fine-tuning to replicate Carl Rogers' communication style",
          "Modular voice architecture: transcription, response generation, and TTS",
          "Exploration of fine-tuning potential and limitations",
          "Integration with multiple voice and language APIs",
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
