"use client";

import { useLanguage } from "./LanguageProvider";

export default function Footer() {
  const { locale } = useLanguage();
  const pt = locale === "pt";
  const links = [
    ["Email", "mailto:miguelalvaro13@gmail.com"],
    ["LinkedIn", "https://www.linkedin.com/in/miguel-oliveira-8b7301125"],
    ["GitHub", "https://github.com/gdlf13"],
    ["ORCID", "https://orcid.org/0000-0002-8176-3100"],
    ["Ciência ID", "https://www.cienciavitae.pt/portal/621D-7549-070F"],
  ];
  return <footer id="contacto" className="bg-[#b94f35] px-5 py-20 text-white lg:px-8 lg:py-28">
    <div className="mx-auto max-w-7xl">
      <p className="eyebrow mb-6 text-white/65">{pt ? "Vamos conversar" : "Let's talk"}</p>
      <a href="mailto:miguelalvaro13@gmail.com" className="serif block max-w-5xl text-[clamp(3rem,7.5vw,7.5rem)] leading-[.92] tracking-[-.05em] transition hover:text-[#171714]">{pt ? <>Ideias difíceis<br/>merecem boas<br/><em className="font-normal">conversas.</em></> : <>Difficult ideas<br/>deserve good<br/><em className="font-normal">conversations.</em></>}</a>
      <div className="mt-16 flex flex-col gap-8 border-t border-white/30 pt-7 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-wrap gap-x-6 gap-y-3">{links.map(([label,href]) => <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="text-sm font-semibold underline decoration-white/30 underline-offset-4 transition hover:decoration-white">{label} ↗</a>)}</div>
        <p className="text-xs leading-relaxed text-white/60 md:text-right">© {new Date().getFullYear()} Miguel Oliveira<br/>{pt ? "Pensado e construído no Porto." : "Thought and built in Porto."}</p>
      </div>
    </div>
  </footer>;
}
