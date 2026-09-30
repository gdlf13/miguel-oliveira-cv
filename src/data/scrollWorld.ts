import type { Locale } from "./translations";

/**
 * Copy das 6 cenas do voo 3D (ver src/lib/world3d). Cada cena corresponde a uma ilha:
 * inicio (cabeça + rede neuronal), pensamento (neurónio), escrita (arquivo),
 * projectos (campus), percurso (as instituições, do ISMAI à FMUP), contacto (carta + selo).
 */
// Um único vermelhão vivo (linguagem "cognitive sumi"): o acento nunca muda de cena para cena.
const VERMILION = "#B02E1C";

type Copy = { label: string; eyebrow: string; title: string; body: string; tags: string[] };

const SCENES: { id: string; accent: string; copy: Record<Locale, Copy> }[] = [
  {
    id: "inicio",
    accent: VERMILION,
    copy: {
      pt: {
        label: "Início",
        eyebrow: "Psicólogo · Investigador · Construtor",
        title: "Compreender pessoas. Construir futuro.",
        body: "Trabalho na fronteira onde a Psicologia encontra a Inteligência Artificial, para que a tecnologia amplie o humano.",
        tags: ["25+ anos em Psicologia", "10+ projectos de IA"],
      },
      en: {
        label: "Home",
        eyebrow: "Psychologist · Researcher · Builder",
        title: "Understand people. Build the future.",
        body: "I work where Psychology meets Artificial Intelligence, so technology can extend what makes us human.",
        tags: ["25+ years in Psychology", "10+ AI projects"],
      },
    },
  },
  {
    id: "pensamento",
    accent: VERMILION,
    copy: {
      pt: {
        label: "Pensamento",
        eyebrow: "Um sistema de pensamento",
        title: "Ampliar, não apagar, o humano.",
        body: "A IA deve ser medida também pela autonomia, dignidade e criatividade que deixa às pessoas.",
        tags: ["Ética da IA", "Psicologia como infraestrutura", "Educação"],
      },
      en: {
        label: "Thinking",
        eyebrow: "A system of thought",
        title: "Extend, don't erase, the human.",
        body: "AI should also be judged by the autonomy, dignity and creativity it leaves to people.",
        tags: ["AI ethics", "Psychology as infrastructure", "Education"],
      },
    },
  },
  {
    id: "escrita",
    accent: VERMILION,
    copy: {
      pt: {
        label: "Escrita",
        eyebrow: "Ensaios",
        title: "Escrever para pensar melhor.",
        body: "Mais de quarenta ensaios sobre psicologia, tecnologia e o futuro do trabalho, da educação e da saúde.",
        tags: ["40+ ensaios", "PT · EN"],
      },
      en: {
        label: "Writing",
        eyebrow: "Essays",
        title: "Writing to think better.",
        body: "Over forty essays on psychology, technology and the future of work, education and health.",
        tags: ["40+ essays", "PT · EN"],
      },
    },
  },
  {
    id: "projectos",
    accent: VERMILION,
    copy: {
      pt: {
        label: "Projectos",
        eyebrow: "IA aplicada",
        title: "Construir para testar ideias.",
        body: "Agentes, tutores e ferramentas que põem o conhecimento psicológico a trabalhar dentro de sistemas inteligentes.",
        tags: ["Tutor de Filosofia", "AI Fact Checker", "OASIS Social Simulation"],
      },
      en: {
        label: "Projects",
        eyebrow: "Applied AI",
        title: "Building to test ideas.",
        body: "Agents, tutors and tools that put psychological knowledge to work inside intelligent systems.",
        tags: ["Philosophy Tutor", "AI Fact Checker", "OASIS Social Simulation"],
      },
    },
  },
  {
    id: "percurso",
    accent: VERMILION,
    copy: {
      pt: {
        label: "Percurso",
        eyebrow: "Do consultório ao doutoramento",
        title: "Uma carreira sem fronteiras.",
        body: "Psicologia, liderança institucional, cibersegurança e Health Data Science na Universidade do Porto.",
        tags: ["ISMAI", "EB 2/3 Napoleão Sousa Marques", "Programa Escolhas", "EBS Pinheiro", "Ordem dos Psicólogos · EFPA", "FMUP"],
      },
      en: {
        label: "Journey",
        eyebrow: "From practice to PhD",
        title: "A career without borders.",
        body: "Psychology, institutional leadership, cybersecurity and Health Data Science at the University of Porto.",
        tags: ["ISMAI", "EB 2/3 Napoleão Sousa Marques", "Escolhas Programme", "EBS Pinheiro", "Portuguese Psychologists' Association · EFPA", "FMUP"],
      },
    },
  },
  {
    id: "contacto",
    accent: VERMILION,
    copy: {
      pt: {
        label: "Contacto",
        eyebrow: "Vamos conversar",
        title: "Ideias difíceis merecem boas conversas.",
        body: "Se trabalhamos na mesma pergunta, escreve-me.",
        tags: [],
      },
      en: {
        label: "Contact",
        eyebrow: "Let's talk",
        title: "Difficult ideas deserve good conversations.",
        body: "If we are working on the same question, write to me.",
        tags: [],
      },
    },
  },
];


export type SceneCopy = { id: string; label: string; eyebrow: string; title: string; body: string; tags: string[]; cta?: { primary: { label: string; href: string }; secondary: { label: string; href: string } } };

export function getScenes(locale: Locale): SceneCopy[] {
  const pt = locale === "pt";
  return SCENES.map((s, i) => {
    const c = s.copy[locale];
    const last = i === SCENES.length - 1;
    return {
      id: s.id, ...c,
      ...(last ? { cta: {
        primary: { label: pt ? "Enviar email" : "Send an email", href: "mailto:miguelalvaro13@gmail.com" },
        secondary: { label: pt ? "Ver CV ↗" : "View CV ↗", href: "/cv/CV_MiguelOliveira_2026.pdf" },
      } } : {}),
    };
  });
}

export const SCENE_COUNT = SCENES.length;
