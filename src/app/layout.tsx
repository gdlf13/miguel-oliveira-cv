import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import { LanguageProvider } from "@/components/LanguageProvider";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const cormorant = Cormorant_Garamond({ variable: "--font-cormorant", subsets: ["latin"], weight: ["400", "500", "600"], style: ["normal", "italic"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://miguel-oliveira-cv.vercel.app"),
  title: "Miguel Oliveira — Psicologia, Inteligência Artificial e Futuro Humano",
  description: "Psicólogo, investigador em Health Data Science e construtor de sistemas de IA. Ensaios, pensamento e projectos na fronteira entre comportamento humano e tecnologia.",
  keywords: ["Miguel Oliveira", "Psicologia", "Inteligência Artificial", "Health Data Science", "Cibersegurança", "Educação", "IA ética"],
  authors: [{ name: "Miguel Álvaro Andrade de Oliveira" }],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Miguel Oliveira — Compreender pessoas. Construir futuro.",
    description: "Psicologia para compreender pessoas. Dados para testar hipóteses. IA para ampliar possibilidades.",
    type: "profile",
    locale: "pt_PT",
    images: [{ url: "/images/og-image.svg", width: 1200, height: 630, alt: "Miguel Oliveira" }],
  },
  twitter: { card: "summary_large_image", title: "Miguel Oliveira — Psicologia × IA", description: "Compreender pessoas. Construir futuro.", images: ["/images/og-image.svg"] },
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const personSchema = {
    "@context": "https://schema.org", "@type": "Person", name: "Miguel Álvaro Andrade de Oliveira",
    url: "https://miguel-oliveira-cv.vercel.app", image: "https://miguel-oliveira-cv.vercel.app/images/profile.png",
    jobTitle: "Psychologist and Health Data Science Researcher",
    sameAs: ["https://www.linkedin.com/in/miguel-oliveira-8b7301125", "https://github.com/gdlf13", "https://orcid.org/0000-0002-8176-3100"],
  };
  return <html lang="pt"><body className={`${inter.variable} ${cormorant.variable} antialiased`}><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} /><LanguageProvider>{children}</LanguageProvider></body></html>;
}
