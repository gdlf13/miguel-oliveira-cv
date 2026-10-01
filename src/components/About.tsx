"use client";

import Image from "next/image";
import { useLanguage } from "./LanguageProvider";

export default function About() {
  const { locale } = useLanguage();
  const pt = locale === "pt";
  const steps = pt ? [
    ["2001—", "Psicologia", "Especialista em Psicologia da Educação e em Psicologia do Trabalho, Social e das Organizações."],
    ["2016—2024", "Liderança profissional", "Direção Nacional da Ordem dos Psicólogos Portugueses; coordenação da equipa de Cibersegurança e de soluções digitais."],
    ["2022—", "IA aplicada", "Exploração e construção de agentes, tutores, modelos adaptados e interfaces entre conhecimento psicológico e sistemas inteligentes."],
    ["2023—", "Health Data Science", "Doutoramento na Faculdade de Medicina da Universidade do Porto, com foco em dados sintéticos de saúde éticos e eficazes."],
    ["2024—", "Perspectiva europeia", "Ad Hoc Working Group for Digitalization da EFPA e docência em Psicologia e Inteligência Artificial."],
  ] : [
    ["2001—", "Psychology", "Specialist in Educational Psychology and in Work, Social and Organisational Psychology."],
    ["2016—2024", "Professional leadership", "National Board of the Portuguese Psychologists' Association; cybersecurity team and digital solutions leadership."],
    ["2022—", "Applied AI", "Building agents, tutors, adapted models and interfaces between psychological knowledge and intelligent systems."],
    ["2023—", "Health Data Science", "PhD at the University of Porto Faculty of Medicine, focused on ethical and effective synthetic health data."],
    ["2024—", "European perspective", "EFPA Ad Hoc Working Group for Digitalization and teaching Psychology and Artificial Intelligence."],
  ];
  return <section id="percurso" className="border-y border-black/15 bg-[#e7e0d4] px-5 py-24 lg:px-8 lg:py-32">
    <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[.8fr_1.2fr]">
      <div>
        <figure className="relative mb-12 w-[210px] lg:mb-14 lg:w-[270px]">
          <span aria-hidden="true" className="pointer-events-none absolute -inset-2.5 rounded-t-[999px] rounded-b-[34px] border border-black/25" />
          <div className="relative overflow-hidden rounded-t-[999px] rounded-b-[26px] border-[1.5px] border-[#171714] bg-[#e7e0d4] shadow-[10px_14px_0_rgba(23,23,20,.07)]">
            <Image src="/images/miguel-retrato.webp" alt="Miguel Oliveira" width={880} height={1100} sizes="(min-width: 1024px) 270px, 210px" className="block h-auto w-full" />
          </div>
        </figure>
        <div className="lg:sticky lg:top-28">
        <p className="eyebrow mb-5 text-[#b94f35]">{pt ? "Percurso" : "Journey"}</p>
        <h2 className="serif text-5xl leading-[1.02] tracking-[-.035em] sm:text-6xl">{pt ? "Uma carreira sem fronteiras disciplinares." : "A career without disciplinary borders."}</h2>
        <p className="mt-7 max-w-md leading-relaxed text-black/60">{pt ? "A continuidade não está nos cargos. Está numa pergunta: como usar conhecimento sobre pessoas para desenhar instituições e tecnologias melhores?" : "The continuity is not in job titles. It is in one question: how can knowledge about people help design better institutions and technologies?"}</p>
        <a href="/cv/CV_MiguelOliveira_2026.pdf" target="_blank" rel="noreferrer" className="mt-8 inline-flex rounded-full bg-[#171714] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#b94f35]">{pt ? "Curriculum completo ↗" : "Full curriculum ↗"}</a>
        </div>
      </div>
      <ol className="border-t border-black/20">
        {steps.map(([year,title,body]) => <li key={title} className="grid gap-3 border-b border-black/20 py-7 sm:grid-cols-[120px_1fr]">
          <span className="text-xs font-bold tracking-[.14em] text-[#b94f35]">{year}</span><div><h3 className="serif mb-2 text-2xl">{title}</h3><p className="max-w-2xl text-sm leading-relaxed text-black/60">{body}</p></div>
        </li>)}
      </ol>
    </div>
  </section>;
}
