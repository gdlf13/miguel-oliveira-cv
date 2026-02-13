"use client";

import { useLanguage } from "./LanguageProvider";

export default function LanguageToggle() {
  const { locale, toggle } = useLanguage();

  return (
    <button
      onClick={toggle}
      aria-label={locale === "pt" ? "Switch to English" : "Mudar para Português"}
      className="relative w-9 h-9 flex items-center justify-center rounded-full
        hover:bg-foreground/10 transition-colors duration-200
        text-xs font-bold tracking-tight"
    >
      {locale === "pt" ? "EN" : "PT"}
    </button>
  );
}
