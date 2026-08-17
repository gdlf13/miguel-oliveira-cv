"use client";

import Image from "next/image";
import Link from "next/link";
import { projects } from "@/data/projects";
import { useLanguage } from "./LanguageProvider";

export default function Projects() {
  const { locale } = useLanguage();
  const pt = locale === "pt";
  return <section id="projectos" className="px-5 py-24 lg:px-8 lg:py-32">
    <div className="mx-auto max-w-7xl">
      <div className="mb-14 grid gap-5 lg:grid-cols-2 lg:items-end">
        <div><p className="eyebrow mb-5 text-[#b94f35]">{pt ? "Do pensamento à prática" : "From thought to practice"}</p><h2 className="serif text-5xl leading-none tracking-[-.035em] sm:text-7xl">{pt ? "Coisas que construí." : "Things I have built."}</h2></div>
        <p className="max-w-lg leading-relaxed text-black/60 lg:justify-self-end">{pt ? "Protótipos, produtos e intervenções que transformam ideias sobre comportamento, educação e inteligência em experiências concretas." : "Prototypes, products and interventions that turn ideas about behaviour, education and intelligence into tangible experiences."}</p>
      </div>
      <div className="grid gap-px overflow-hidden border border-black/15 bg-black/15 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => <Link key={project.slug} href={`/projects/${project.slug}`} className="group flex min-h-[430px] flex-col bg-[#f9f7f1] p-5 transition hover:bg-white sm:p-7">
          <div className="mb-6 flex items-center justify-between text-[10px] font-bold uppercase tracking-[.16em] text-black/45"><span>{String(i + 1).padStart(2,"0")} / {project.category}</span><span className="text-xl transition group-hover:translate-x-1 group-hover:text-[#b94f35]">↗</span></div>
          <div className="relative mb-7 aspect-[16/10] overflow-hidden bg-[#e8e3d8]">
            <Image src={project.image} alt="" fill sizes="(max-width: 768px) 90vw, 33vw" className="object-cover grayscale-[30%] transition duration-500 group-hover:scale-[1.03] group-hover:grayscale-0" />
          </div>
          <h3 className="serif mb-3 text-3xl leading-tight">{project.title}</h3>
          <p className="mt-auto text-sm leading-relaxed text-black/55">{project.description}</p>
        </Link>)}
      </div>
    </div>
  </section>;
}
