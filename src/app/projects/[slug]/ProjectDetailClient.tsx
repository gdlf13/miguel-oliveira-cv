"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { type Project } from "@/data/projects";
import { useLanguage } from "@/components/LanguageProvider";

interface Props {
  project: Project;
  categoryColor: string;
}

export default function ProjectDetailClient({ project, categoryColor }: Props) {
  const { t } = useLanguage();
  const pageRef = useRef<HTMLDivElement>(null);

  const detailedDesc =
    t.projectDetail.detailedDescriptions[project.slug] || project.description;
  const categoryLabel = t.categories[project.category] || project.category;
  const features =
    t.projectDetail.featureTranslations[project.slug] || project.features;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".detail-hero-img", {
        scale: 1.1,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });
      gsap.from(".detail-title", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        ease: "power4.out",
      });
      gsap.from(".detail-desc", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.35,
        ease: "power4.out",
      });
      gsap.from(".detail-section", {
        y: 30,
        opacity: 0,
        duration: 0.7,
        delay: 0.5,
        stagger: 0.12,
        ease: "power4.out",
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen bg-background text-foreground">
      {/* Back button */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-card-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center">
          <Link
            href="/#projectos"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-foreground transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            {t.projectDetail.back}
          </Link>
        </div>
      </div>

      <main className="pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Hero image */}
          <div className="detail-hero-img relative aspect-video max-w-4xl mx-auto rounded-2xl overflow-hidden border border-card-border mb-10">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 900px"
              priority
            />
          </div>

          {/* Title + category */}
          <div className="detail-title max-w-3xl mx-auto mb-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${categoryColor}`}
              >
                {categoryLabel}
              </span>
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full
                    bg-accent/20 text-accent hover:bg-accent/30 transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  {t.projects.viewDemo}
                </a>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              {project.title}
            </h1>
          </div>

          {/* Description */}
          <div className="detail-desc max-w-3xl mx-auto mb-12">
            <p className="text-lg sm:text-xl leading-relaxed text-muted">
              {detailedDesc}
            </p>
          </div>

          {/* Tech stack + Features grid */}
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Tech stack */}
            <div className="detail-section p-6 rounded-2xl border border-card-border bg-card">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
                {t.projectDetail.techStack}
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 text-sm font-medium rounded-lg
                      bg-accent/10 text-accent border border-accent/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="detail-section p-6 rounded-2xl border border-card-border bg-card">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                  <polyline points="9 11 12 14 22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
                {t.projectDetail.features}
              </h2>
              <ul className="space-y-3">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-muted leading-relaxed">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
