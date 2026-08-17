"use client";

import { useState } from "react";
import LanguageToggle from "./LanguageToggle";
import { useLanguage } from "./LanguageProvider";

export default function Header() {
  const { locale } = useLanguage();
  const [open, setOpen] = useState(false);
  const labels = locale === "pt"
    ? { thought: "Pensamento", writing: "Escrita", work: "Projectos", about: "Percurso", contact: "Contacto" }
    : { thought: "Thinking", writing: "Writing", work: "Projects", about: "Journey", contact: "Contact" };
  const links = [
    ["#pensamento", labels.thought], ["#escrita", labels.writing], ["#projectos", labels.work],
    ["#percurso", labels.about], ["#contacto", labels.contact],
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-black/10 bg-[#f2efe7]/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8" aria-label="Navegação principal">
        <a href="#inicio" className="flex items-baseline gap-2" onClick={() => setOpen(false)}>
          <span className="serif text-xl font-semibold">Miguel Oliveira</span>
          <span className="hidden text-[10px] font-bold uppercase tracking-[.18em] text-[#b94f35] sm:inline">Psicologia × IA</span>
        </a>
        <div className="hidden items-center gap-6 lg:flex">
          {links.map(([href, label]) => <a key={href} href={href} className="text-xs font-semibold tracking-wide text-black/60 transition hover:text-black">{label}</a>)}
          <LanguageToggle />
          <a href="/cv/CV_MiguelOliveira_2026.pdf" target="_blank" rel="noreferrer" className="rounded-full bg-[#171714] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#b94f35]">CV ↗</a>
        </div>
        <div className="flex items-center gap-2 lg:hidden">
          <LanguageToggle />
          <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Abrir menu" className="grid h-10 w-10 place-items-center rounded-full border border-black/15">
            <span className="text-xl leading-none">{open ? "×" : "≡"}</span>
          </button>
        </div>
      </nav>
      {open && <div className="border-t border-black/10 bg-[#f2efe7] px-5 py-5 lg:hidden">
        {links.map(([href, label]) => <a key={href} href={href} onClick={() => setOpen(false)} className="serif block border-b border-black/10 py-3 text-2xl">{label}</a>)}
        <a href="/cv/CV_MiguelOliveira_2026.pdf" target="_blank" rel="noreferrer" className="mt-5 inline-flex rounded-full bg-[#171714] px-5 py-3 text-sm font-semibold text-white">CV completo ↗</a>
      </div>}
    </header>
  );
}
