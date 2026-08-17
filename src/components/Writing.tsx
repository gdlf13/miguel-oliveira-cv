"use client";

import { useMemo, useState } from "react";
import { articles, type ArticleTheme } from "@/data/articles";
import { useLanguage } from "./LanguageProvider";

const themes: ("Todos" | ArticleTheme)[] = ["Todos", "Inteligência Artificial", "Psicologia & Sociedade", "Educação", "Trabalho & Economia", "Cibersegurança"];

export default function Writing() {
  const { locale } = useLanguage();
  const pt = locale === "pt";
  const [theme, setTheme] = useState<(typeof themes)[number]>("Todos");
  const [publication, setPublication] = useState("Todas");
  const [query, setQuery] = useState("");
  const results = useMemo(() => articles.filter(a =>
    (theme === "Todos" || a.theme === theme) &&
    (publication === "Todas" || a.publication === publication) &&
    (a.title + " " + a.excerpt).toLocaleLowerCase("pt").includes(query.toLocaleLowerCase("pt"))
  ), [theme, publication, query]);
  const featured = articles[0];
  const date = (value: string) => new Intl.DateTimeFormat(pt ? "pt-PT" : "en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value + "T12:00:00"));

  return <section id="escrita" className="px-5 py-24 lg:px-8 lg:py-32">
    <div className="mx-auto max-w-7xl">
      <div className="mb-14 grid gap-6 lg:grid-cols-[1fr_.8fr] lg:items-end">
        <div><p className="eyebrow mb-5 text-[#b94f35]">{pt ? "Arquivo de ideias" : "Ideas archive"}</p><h2 className="serif text-5xl leading-[.95] tracking-[-.04em] sm:text-7xl">{pt ? <>Escrever é pensar<br/><em className="font-normal">em público.</em></> : <>Writing is thinking<br/><em className="font-normal">in public.</em></>}</h2></div>
        <p className="max-w-xl leading-relaxed text-black/60 lg:justify-self-end">{pt ? `Um arquivo integral de ${articles.length} ensaios publicados no Jornal Económico e no Tek Notícias / SAPO Tek — tecnologia vista através do comportamento humano.` : `The complete archive of ${articles.length} essays published in Jornal Económico and Tek Notícias / SAPO Tek — technology seen through human behaviour.`}</p>
      </div>

      <a href={featured.url} target="_blank" rel="noreferrer" className="group mb-12 grid overflow-hidden bg-[#b94f35] text-white lg:grid-cols-[.7fr_1.3fr]">
        <div className="flex min-h-64 flex-col justify-between border-b border-white/25 p-7 lg:border-b-0 lg:border-r">
          <span className="eyebrow text-white/65">{pt ? "Mais recente" : "Latest"}</span><span className="serif text-8xl text-white/20">“</span><span className="text-xs text-white/65">{featured.publication}<br/>{date(featured.date)}</span>
        </div>
        <div className="flex min-h-64 flex-col justify-between p-7 sm:p-10">
          <h3 className="serif max-w-4xl text-4xl leading-tight sm:text-6xl">{featured.title}</h3><div className="mt-8 flex items-end justify-between gap-5"><p className="max-w-2xl line-clamp-3 text-sm leading-relaxed text-white/65">{featured.excerpt}</p><span className="text-3xl transition group-hover:translate-x-2">→</span></div>
        </div>
      </a>

      <div className="mb-7 grid gap-4 border-y border-black/15 py-5 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="flex flex-wrap gap-2">{themes.map(item => <button key={item} onClick={() => setTheme(item)} className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${theme === item ? "border-[#171714] bg-[#171714] text-white" : "border-black/15 hover:border-black/50"}`}>{item === "Todos" && !pt ? "All" : item}</button>)}</div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <select value={publication} onChange={e => setPublication(e.target.value)} aria-label="Filtrar publicação" className="rounded-full border border-black/15 bg-transparent px-4 py-2 text-xs font-semibold outline-none focus:border-[#b94f35]">
            <option value="Todas">{pt ? "Todas as publicações" : "All publications"}</option><option>Tek Notícias · SAPO Tek</option><option>Jornal Económico</option>
          </select>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder={pt ? "Pesquisar no arquivo…" : "Search the archive…"} className="rounded-full border border-black/15 bg-transparent px-4 py-2 text-xs outline-none placeholder:text-black/40 focus:border-[#b94f35]" />
        </div>
      </div>

      <p className="mb-3 text-xs font-semibold text-black/45">{results.length} {pt ? "artigos" : "articles"}</p>
      <div className="border-t border-black/20">
        {results.map((article, i) => <a key={article.url} href={article.url} target="_blank" rel="noreferrer" className="group grid gap-3 border-b border-black/20 py-6 transition hover:bg-[#f9f7f1] sm:grid-cols-[48px_130px_1fr_170px_30px] sm:items-center sm:px-3">
          <span className="hidden text-[10px] font-bold text-black/35 sm:block">{String(i + 1).padStart(2,"0")}</span>
          <span className="text-[10px] font-bold uppercase tracking-[.12em] text-[#b94f35]">{article.theme}</span>
          <span className="serif text-xl leading-tight sm:text-2xl">{article.title}</span>
          <span className="text-xs leading-relaxed text-black/45"><strong className="block font-semibold text-black/60">{article.publication}</strong>{date(article.date)}</span>
          <span className="text-xl transition group-hover:translate-x-1 group-hover:text-[#b94f35]">↗</span>
        </a>)}
        {results.length === 0 && <p className="py-16 text-center text-black/50">{pt ? "Nenhum artigo encontrado." : "No articles found."}</p>}
      </div>
      <p className="mt-6 text-xs leading-relaxed text-black/45">{pt ? "Arquivo verificado através das páginas de autor, sitemaps e páginas individuais das publicações. Tek Notícias é a designação editorial actual do SAPO Tek." : "Archive verified through author pages, sitemaps and individual publication pages. Tek Notícias is the current editorial name of SAPO Tek."}</p>
    </div>
  </section>;
}
