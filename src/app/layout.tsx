import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { LanguageProvider } from "@/components/LanguageProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://miguel-oliveira-cv.vercel.app"),
  title: "Miguel Oliveira — Psicologia · Data Science · AI Engineering",
  description:
    "Portfolio de projectos em Psicologia, Ciência de Dados e Engenharia de IA. CV, projectos e contacto.",
  keywords: [
    "Miguel Oliveira",
    "Psicologia",
    "Data Science",
    "AI Engineering",
    "Portfolio",
    "CV",
  ],
  authors: [{ name: "Miguel Álvaro Andrade de Oliveira" }],
  openGraph: {
    title: "Miguel Oliveira — Psicologia · Data Science · AI Engineering",
    description:
      "Portfolio de projectos em Psicologia, Ciência de Dados e Engenharia de IA.",
    type: "website",
    locale: "pt_PT",
    images: [
      {
        url: "/images/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Miguel Oliveira — Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Miguel Oliveira — Psicologia · Data Science · AI Engineering",
    description:
      "Portfolio de projectos em Psicologia, Ciência de Dados e Engenharia de IA.",
    images: ["/images/og-image.svg"],
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" className="dark">
      <body className={`${inter.variable} antialiased`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
