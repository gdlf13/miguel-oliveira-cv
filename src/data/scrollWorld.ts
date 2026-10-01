import type { Locale } from "./translations";
import { projects } from "./projects";
import { articles } from "./articles";

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
        tags: ["LinkedIn", "GitHub", "ORCID"],
      },
      en: {
        label: "Contact",
        eyebrow: "Let's talk",
        title: "Difficult ideas deserve good conversations.",
        body: "If we are working on the same question, write to me.",
        tags: ["LinkedIn", "GitHub", "ORCID"],
      },
    },
  },
];


export type SceneCopy = { id: string; label: string; eyebrow: string; title: string; body: string; tags: string[]; tagLinks: (string | null)[]; hint: string; cta?: { primary: { label: string; href: string }; secondary: { label: string; href: string } } };

export function getScenes(locale: Locale): SceneCopy[] {
  const pt = locale === "pt";
  return SCENES.map((s, i) => {
    const c = s.copy[locale];
    const last = i === SCENES.length - 1;
    return {
      id: s.id, ...c, tagLinks: TAG_LINKS[s.id] ?? [], hint: HINTS[s.id]?.[locale] ?? "",
      ...(last ? { cta: {
        primary: { label: pt ? "Enviar email" : "Send an email", href: "mailto:miguelalvaro13@gmail.com" },
        secondary: { label: pt ? "Ver CV ↗" : "View CV ↗", href: "/cv/CV_MiguelOliveira_2026.pdf" },
      } } : {}),
    };
  });
}

export const SCENE_COUNT = SCENES.length;

// ---------------------------------------------------------------------------------------------------------------------------
// Ilhas clicáveis. O mundo 3D (src/lib/world3d/islands/*) só sabe ids de objectos ("percurso.ismai", "proj:jogaletras"…);
// é aqui que cada id passa a ter destino e legenda. "#x" = secção da página · "/x" = rota do site · "http…" = site externo (novo separador).
// ---------------------------------------------------------------------------------------------------------------------------
export type Hotspot = { href: string; label: Record<Locale, string> };

const EMAIL = "mailto:miguelalvaro13@gmail.com";
const CV = "/cv/CV_MiguelOliveira_2026.pdf";
const bi = (pt: string, en: string = pt) => ({ pt, en });
// artigo mais recente de cada publicação (a pilha de revistas/jornais da ilha Escrita)
const latest = (pub: string) => [...articles].filter((a) => a.publication === pub).sort((a, b) => b.date.localeCompare(a.date))[0]?.url ?? "#escrita";

export const HOTSPOTS: Record<string, Hotspot> = {
  "inicio.bust": { href: "#percurso", label: bi("O meu percurso", "My journey") },
  "pensamento.neuron": { href: "#pensamento", label: bi("Pensamento · como vejo a IA", "Thinking · how I see AI") },
  "escrita.book": { href: "#escrita", label: bi("Ler os ensaios", "Read the essays") },
  "escrita.arquivo": { href: "#escrita", label: bi("Arquivo · 40+ ensaios", "Archive · 40+ essays") },
  "escrita.pen": { href: "#escrita", label: bi("Escrita", "Writing") },
  "escrita.ensaios": { href: "#escrita", label: bi("Todos os ensaios", "All essays") },
  "escrita.tek": { href: latest("Tek Notícias · SAPO Tek"), label: bi("Último artigo · SAPO Tek ↗", "Latest article · SAPO Tek ↗") },
  "escrita.je": { href: latest("Jornal Económico"), label: bi("Último artigo · Jornal Económico ↗", "Latest article · Jornal Económico ↗") },
  "percurso.ismai": { href: "https://www.umaia.pt", label: bi("ISMAI · Universidade da Maia ↗", "ISMAI · University of Maia ↗") },
  "percurso.eb23": { href: "https://aetrofa.com/eb-2-3-professor-napoleao-sousa-marques/", label: bi("EB 2/3 Prof. Napoleão Sousa Marques ↗", "EB 2/3 Prof. Napoleão Sousa Marques ↗") },
  "percurso.escolhas": { href: "https://www.programaescolhas.pt/", label: bi("Programa Escolhas ↗", "Escolhas Programme ↗") },
  "percurso.pinheiro": { href: "https://www.ebspinheiro.net/cms/", label: bi("EBS de Pinheiro ↗", "EBS Pinheiro ↗") },
  "percurso.opp": { href: "https://www.ordemdospsicologos.pt", label: bi("Ordem dos Psicólogos Portugueses ↗", "Portuguese Psychologists' Association ↗") },
  "percurso.fmup": { href: "https://med.up.pt", label: bi("FMUP · Faculdade de Medicina da U.Porto ↗", "FMUP · Faculty of Medicine, U.Porto ↗") },
  "contacto.email": { href: EMAIL, label: bi("Enviar email", "Send an email") },
  "contacto.cv": { href: CV, label: bi("Ver o CV (PDF) ↗", "View the CV (PDF) ↗") },
  "contacto.linkedin": { href: "https://www.linkedin.com/in/miguel-oliveira-8b7301125", label: bi("LinkedIn ↗") },
  "contacto.github": { href: "https://github.com/gdlf13", label: bi("GitHub ↗") },
  "contacto.orcid": { href: "https://orcid.org/0000-0002-8176-3100", label: bi("ORCID ↗") },
};
// um pavilhão por projecto: "proj:<slug>" -> /projects/<slug>
projects.forEach((p) => { HOTSPOTS["proj:" + p.slug] = { href: `/projects/${p.slug}`, label: bi(p.title) }; });

export function resolveHotspot(id: string, locale: Locale): { href: string; label: string; external: boolean } | null {
  const h = HOTSPOTS[id];
  if (!h) return null;
  return { href: h.href, label: h.label[locale], external: /^https?:/.test(h.href) || h.href.endsWith(".pdf") };
}

// chips de cada cena que também são links (alinhados por índice com `tags`; null = sem link)
const TAG_LINKS: Record<string, (string | null)[]> = {
  inicio: ["#percurso", "#projectos"],
  pensamento: ["#pensamento", "#pensamento", "#pensamento"],
  escrita: ["#escrita", null],
  projectos: ["/projects/tutor-filosofia", "/projects/ai-fact-checker", "/projects/oasis-social-simulation"],
  percurso: ["percurso.ismai", "percurso.eb23", "percurso.escolhas", "percurso.pinheiro", "percurso.opp", "percurso.fmup"].map((id) => HOTSPOTS[id].href),
  contacto: ["contacto.linkedin", "contacto.github", "contacto.orcid"].map((id) => HOTSPOTS[id].href),
};

// dica curta por cena (o que é clicável na ilha)
const HINTS: Record<string, Record<Locale, string>> = {
  inicio: bi("Clica na escultura", "Click the sculpture"),
  pensamento: bi("Clica no neurónio", "Click the neuron"),
  escrita: bi("Clica no livro, no arquivo ou nas pilhas de jornais", "Click the book, the archive or the newspaper stacks"),
  projectos: bi("Clica num pavilhão para abrir o projecto", "Click a pavilion to open the project"),
  percurso: bi("Clica num edifício para abrir o site", "Click a building to open its website"),
  contacto: bi("Clica na carta, no CV ou nos cartões", "Click the letter, the CV or the cards"),
};
