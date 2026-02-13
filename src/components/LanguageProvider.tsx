"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { type Locale, translations } from "@/data/translations";

type TranslationType = (typeof translations)[Locale];

interface LanguageContextType {
  locale: Locale;
  t: TranslationType;
  toggle: () => void;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: "pt",
  t: translations.pt,
  toggle: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("pt");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("lang") as Locale | null;
    if (stored === "en" || stored === "pt") {
      setLocale(stored);
    }
  }, []);

  const toggle = () => {
    const next: Locale = locale === "pt" ? "en" : "pt";
    setLocale(next);
    localStorage.setItem("lang", next);
    document.documentElement.lang = next;
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <LanguageContext.Provider value={{ locale, t: translations[locale], toggle }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
