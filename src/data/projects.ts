export type Category = "Educação" | "Agentes" | "Dados" | "Apps";

export interface Project {
  slug: string;
  title: string;
  description: string;
  category: Category;
  demo: string | null;
  image: string;
  tech: string[];
  features: string[];
}

export const categoryColors: Record<Category, string> = {
  Educação: "bg-blue-900 text-blue-200",
  Agentes: "bg-purple-900 text-purple-200",
  Dados: "bg-amber-900 text-amber-200",
  Apps: "bg-teal-900 text-teal-200",
};

export const categoryIcons: Record<Category, string> = {
  Educação: "📚",
  Agentes: "🤖",
  Dados: "📊",
  Apps: "🚀",
};

export const projects: Project[] = [
  {
    slug: "jogaletras",
    title: "JogaLetras",
    description: "App interactiva para treino de alfabetização infantil.",
    category: "Educação",
    demo: null,
    image: "/images/projects/jogaletras.svg",
    tech: ["Python", "Streamlit", "NLP", "Gamification"],
    features: [
      "Exercícios adaptativos de leitura e escrita",
      "Sistema de pontuação e recompensas para motivar crianças",
      "Interface colorida e intuitiva para utilizadores jovens",
      "Progressão por níveis de dificuldade",
    ],
  },
  {
    slug: "ai-fact-checker",
    title: "AI Fact Checker",
    description: "Plataforma de verificação automática de factos com IA.",
    category: "Agentes",
    demo: null,
    image: "/images/projects/ai-fact-checker.svg",
    tech: ["Python", "LangChain", "OpenAI API", "Web Scraping", "RAG"],
    features: [
      "Verificação automática de afirmações contra fontes fiáveis",
      "Pipeline RAG para consulta de bases de conhecimento",
      "Classificação de veracidade com níveis de confiança",
      "Geração de relatório explicativo com fontes citadas",
    ],
  },
  {
    slug: "amancio",
    title: "Amâncio o Psicólogo",
    description:
      "Chatbot psicoeducacional de bem-estar mental baseado em evidência.",
    category: "Educação",
    demo: null,
    image: "/images/projects/amancio.svg",
    tech: ["Python", "OpenAI API", "Streamlit", "Psicologia Clínica"],
    features: [
      "Conversação empática baseada em técnicas cognitivo-comportamentais",
      "Conteúdos psicoeducacionais validados por evidência científica",
      "Detecção de sinais de crise com encaminhamento seguro",
      "Sistema de guardrails éticos para respostas responsáveis",
    ],
  },
  {
    slug: "interactive-report",
    title: "Interactive AI Report",
    description: "Relatórios interactivos com chat IA e gráficos dinâmicos.",
    category: "Dados",
    demo: null,
    image: "/images/projects/interactive-report.svg",
    tech: ["Python", "Streamlit", "Plotly", "OpenAI API", "Pandas"],
    features: [
      "Upload de dados com geração automática de visualizações",
      "Chat IA para explorar dados com linguagem natural",
      "Gráficos interactivos (barras, linhas, dispersão, mapas)",
      "Exportação de relatórios em formato partilhável",
    ],
  },
  {
    slug: "linkedin-query",
    title: "LinkedIn Query Generator",
    description:
      "Gerador automático de pesquisas LinkedIn para recrutadores.",
    category: "Dados",
    demo: null,
    image: "/images/projects/linkedin-query.svg",
    tech: ["Python", "Streamlit", "Boolean Logic", "UX Design"],
    features: [
      "Construção de queries booleanas complexas sem conhecimento técnico",
      "Templates pré-definidos por sector e função",
      "Pré-visualização e cópia rápida das queries geradas",
      "Optimização de operadores AND/OR/NOT para máxima precisão",
    ],
  },
  {
    slug: "radar-vagas",
    title: "Radar de Vagas",
    description:
      "Plataforma de monitorização do mercado de emprego português.",
    category: "Apps",
    demo: null,
    image: "/images/projects/radar-vagas.svg",
    tech: ["Python", "Selenium", "BeautifulSoup", "Pandas", "Streamlit"],
    features: [
      "Monitorização automática de vagas em múltiplos portais portugueses",
      "Filtragem por localização, sector e tipo de contrato",
      "Alertas para novas vagas que correspondem ao perfil",
      "Dashboard com tendências e estatísticas do mercado",
    ],
  },
  {
    slug: "ad-chase",
    title: "Ad Chase Agent",
    description: "Agente de scraping de vagas IT de múltiplos portais.",
    category: "Agentes",
    demo: null,
    image: "/images/projects/ad-chase.svg",
    tech: ["Python", "Selenium", "BeautifulSoup", "Multi-Agent", "Scheduling"],
    features: [
      "Scraping orquestrado de vários portais de emprego em simultâneo",
      "Agente autónomo com ciclos de recolha programados",
      "Deduplicação inteligente de vagas entre portais",
      "Exportação estruturada para análise posterior",
    ],
  },
  {
    slug: "linkedin-rh",
    title: "LinkedIn RH Search",
    description:
      "Ferramenta de filtragem e busca LinkedIn de recrutadores.",
    category: "Dados",
    demo: null,
    image: "/images/projects/linkedin-rh.svg",
    tech: ["Python", "Streamlit", "Data Filtering", "UX Design"],
    features: [
      "Pesquisa avançada de perfis de recrutadores por empresa e sector",
      "Filtragem multi-critério com interface intuitiva",
      "Ranking de relevância baseado em correspondência de perfil",
      "Exportação de listas filtradas para contacto directo",
    ],
  },
  {
    slug: "tutor-filosofia",
    title: "Tutor de Filosofia",
    description:
      "Tutor virtual IA para exames nacionais de Filosofia 11.º ano.",
    category: "Educação",
    demo: null,
    image: "/images/projects/tutor-filosofia.svg",
    tech: ["Python", "OpenAI API", "Streamlit", "RAG", "Currículo Nacional"],
    features: [
      "Explicação de conceitos filosóficos alinhada com o programa nacional",
      "Exercícios de exame com correcção automática e feedback",
      "Diálogo socrático adaptativo ao nível do aluno",
      "Cobertura dos autores e temas do 11.º ano",
    ],
  },
  {
    slug: "mealhada",
    title: "Mealhada 2025",
    description: "Apresentação web interactiva sobre IA na educação.",
    category: "Apps",
    demo: null,
    image: "/images/projects/mealhada.svg",
    tech: ["Next.js", "React", "Tailwind CSS", "Framer Motion"],
    features: [
      "Apresentação web imersiva com animações e transições",
      "Conteúdos sobre aplicações práticas de IA na sala de aula",
      "Navegação por slides com suporte mobile",
      "Exemplos interactivos de ferramentas IA para professores",
    ],
  },
];
