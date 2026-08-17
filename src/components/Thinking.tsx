"use client";

import { useLanguage } from "./LanguageProvider";

export default function Thinking() {
  const { locale } = useLanguage();
  const pt = locale === "pt";
  const ideas = pt ? [
    ["01", "A inteligência deve ampliar, não apagar, o humano.", "Avaliar IA apenas por velocidade e precisão é insuficiente. Os sistemas que criamos devem também ser medidos pela autonomia, dignidade, criatividade e capacidade de relação que deixam às pessoas."],
    ["02", "A Psicologia é infraestrutura para a IA.", "Vieses, motivação, confiança, decisão e comportamento não são detalhes de interface. São parte do código invisível que determina se uma tecnologia funciona — e para quem funciona."],
    ["03", "Delegar a máquinas exige mais humanidade, não menos.", "Quando agentes executam, o nosso valor desloca-se do fazer para o decidir: formular objectivos, reconhecer limites, assumir responsabilidade e perguntar o que merece ser feito."],
    ["04", "Educar para respostas prontas é preparar para o passado.", "Num mundo onde respostas são abundantes, a escola deve cultivar perguntas, julgamento, curiosidade, colaboração e a coragem intelectual de não aceitar a primeira solução."],
  ] : [
    ["01", "Intelligence should extend, not erase, the human.", "Speed and accuracy are not enough. AI should also be judged by the autonomy, dignity, creativity and capacity for connection it leaves to people."],
    ["02", "Psychology is infrastructure for AI.", "Bias, motivation, trust, decision-making and behaviour are not interface details. They are part of the invisible code that determines whether technology works — and for whom."],
    ["03", "Delegating to machines demands more humanity, not less.", "When agents execute, our value shifts from doing to deciding: setting goals, recognising limits, taking responsibility and asking what deserves to be done."],
    ["04", "Teaching ready-made answers is preparation for the past.", "Where answers are abundant, education must cultivate questions, judgement, curiosity, collaboration and the intellectual courage to reject the first solution."],
  ];

  return <section id="pensamento" className="bg-[#171714] px-5 py-24 text-[#f2efe7] lg:px-8 lg:py-32">
    <div className="mx-auto max-w-7xl">
      <div className="mb-16 grid gap-6 lg:grid-cols-2 lg:items-end">
        <div><p className="eyebrow mb-5 text-[#d4775d]">{pt ? "Um sistema de pensamento" : "A system of thought"}</p><h2 className="serif text-5xl leading-[.98] tracking-[-.035em] sm:text-7xl">{pt ? <>Quatro ideias que<br/><em className="font-normal">atravessam</em> o meu trabalho.</> : <>Four ideas that<br/><em className="font-normal">run through</em> my work.</>}</h2></div>
        <p className="max-w-lg text-base leading-relaxed text-white/55 lg:justify-self-end">{pt ? "Não me interessa a tecnologia como espectáculo. Interessa-me como força que reorganiza o trabalho, a educação, a saúde e a nossa ideia de inteligência." : "Technology as spectacle does not interest me. I care about it as a force reshaping work, education, health and our idea of intelligence."}</p>
      </div>
      <div className="border-t border-white/20">
        {ideas.map(([n, title, body]) => <article key={n} className="group grid gap-5 border-b border-white/20 py-9 lg:grid-cols-[80px_1fr_1fr] lg:gap-10">
          <span className="text-xs font-bold tracking-[.18em] text-[#d4775d]">{n}</span>
          <h3 className="serif text-3xl leading-tight transition group-hover:text-[#d4775d] sm:text-4xl">{title}</h3>
          <p className="max-w-xl leading-relaxed text-white/55">{body}</p>
        </article>)}
      </div>
    </div>
  </section>;
}
