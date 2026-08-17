"use client";

import Image from "next/image";
import { useLanguage } from "./LanguageProvider";

export default function Hero() {
  const { locale } = useLanguage();
  const pt = locale === "pt";
  return (
    <section id="inicio" className="paper-noise relative min-h-screen overflow-hidden px-5 pb-16 pt-28 lg:px-8 lg:pb-24 lg:pt-32">
      <div className="mx-auto grid max-w-7xl items-end gap-12 lg:grid-cols-[1.35fr_.65fr]">
        <div className="animate-rise">
          <p className="eyebrow mb-6 text-[#b94f35]">{pt ? "Psicólogo · Investigador · Construtor" : "Psychologist · Researcher · Builder"}</p>
          <h1 className="serif max-w-5xl text-[clamp(3.35rem,8.4vw,8.2rem)] font-medium leading-[.9] tracking-[-.055em]">
            {pt ? <>Compreender<br/>pessoas.<br/><em className="font-normal text-[#b94f35]">Construir</em> futuro.</> : <>Understand<br/>people.<br/><em className="font-normal text-[#b94f35]">Build</em> the future.</>}
          </h1>
          <div className="animate-line my-8 h-px max-w-3xl bg-black/25" />
          <div className="grid max-w-3xl gap-6 sm:grid-cols-[1fr_auto] sm:items-end">
            <p className="max-w-2xl text-lg leading-relaxed text-black/65 sm:text-xl">
              {pt
                ? "Trabalho na fronteira onde a Psicologia encontra a Inteligência Artificial — para que a tecnologia amplie a capacidade humana sem perder de vista aquilo que nos torna humanos."
                : "I work where Psychology meets Artificial Intelligence — so technology can extend human capability without losing sight of what makes us human."}
            </p>
            <a href="#pensamento" className="inline-flex h-14 items-center justify-center rounded-full border border-black/20 px-6 text-sm font-bold transition hover:border-[#b94f35] hover:bg-[#b94f35] hover:text-white">
              {pt ? "Ler o meu pensamento ↓" : "Explore my thinking ↓"}
            </a>
          </div>
        </div>

        <div className="animate-rise-delay relative mx-auto w-full max-w-sm lg:mx-0 lg:justify-self-end">
          <div className="absolute -left-5 -top-5 h-full w-full border border-[#b94f35]/60" />
          <div className="relative aspect-[4/5] overflow-hidden bg-[#d8d1c2] grayscale-[15%]">
            <Image src="/images/profile.png" alt="Miguel Oliveira" fill priority sizes="(max-width: 1024px) 90vw, 32vw" className="object-cover" />
          </div>
          <div className="relative mt-4 flex justify-between text-[10px] font-bold uppercase tracking-[.16em] text-black/55">
            <span>Porto, Portugal</span><span>Desde 2001</span>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-16 grid max-w-7xl grid-cols-2 gap-px border-y border-black/15 bg-black/15 sm:grid-cols-4">
        {[
          ["25+", pt ? "anos em Psicologia" : "years in Psychology"],
          ["40+", pt ? "ensaios publicados" : "published essays"],
          ["10+", pt ? "projectos de IA" : "AI projects"],
          ["1", pt ? "tese: tecnologia humana" : "thesis: human technology"],
        ].map(([n, label]) => <div key={label} className="bg-[#f2efe7] px-4 py-5"><strong className="serif block text-3xl font-normal">{n}</strong><span className="text-xs text-black/55">{label}</span></div>)}
      </div>
    </section>
  );
}
