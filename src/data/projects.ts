export type Category = "Educação" | "Agentes" | "Dados" | "Apps" | "Cibersegurança";

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
  Cibersegurança: "bg-yellow-900 text-yellow-200",
};

export const categoryIcons: Record<Category, string> = {
  Educação: "📚",
  Agentes: "🤖",
  Dados: "📊",
  Apps: "🚀",
  Cibersegurança: "🛡️",
};

export const projects: Project[] = [
  {
    slug: "internet-segura",
    title: "O que a Internet diz de si",
    description: "Campanha de sensibilização para comportamentos seguros na Internet, em parceria com o CNCS.",
    category: "Cibersegurança",
    demo: "https://www.ordemdospsicologos.pt/pt/noticia/3962",
    image: "/images/projects/internet-segura.jpg",
    tech: ["Cibersegurança", "Psicologia", "Comunicação", "Literacia Digital", "Políticas Públicas"],
    features: [
      "Criação e coordenação da equipa de Cibersegurança da OPP",
      "Campanha nacional com Júlia Pinheiro e Júlio Isidro",
      "Parceria com o Centro Nacional de Cibersegurança (CNCS)",
      "Sensibilização para comportamentos seguros na Internet para população sénior",
    ],
  },
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
    slug: "oasis-social-simulation",
    title: "OASIS Social Simulation",
    description:
      "Simulador de redes sociais com agentes LLM à escala de um milhão.",
    category: "Agentes",
    demo: null,
    image: "/images/projects/oasis-social-simulation.svg",
    tech: ["Python", "LLM", "vLLM", "Multi-Agent", "Social Simulation"],
    features: [
      "Simulação escalável até um milhão de agentes autónomos",
      "Ambientes dinâmicos que replicam Twitter e Reddit",
      "21 acções distintas: seguir, comentar, repostar, entre outras",
      "Sistemas de recomendação integrados por interesse e popularidade",
    ],
  },
  {
    slug: "verbi-carl-rogers",
    title: "Verbi — Carl Rogers Voice Assistant",
    description:
      "Assistente de voz com fine-tuning de LLM para simular Carl Rogers.",
    category: "Agentes",
    demo: null,
    image: "/images/projects/verbi-carl-rogers.svg",
    tech: ["Python", "Fine-Tuning", "OpenAI API", "Groq", "Deepgram", "TTS"],
    features: [
      "Fine-tuning de modelo de linguagem para replicar o estilo de Carl Rogers",
      "Arquitectura modular de voz: transcrição, geração de resposta e TTS",
      "Exploração das potencialidades e limites da técnica de fine-tuning",
      "Integração com múltiplas APIs de voz e linguagem",
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
