"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/data/projects";
import ProjectCard from "./ProjectCard";
import { useLanguage } from "./LanguageProvider";

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { clipPath: "inset(0 100% 0 0)", opacity: 0 },
        {
          clipPath: "inset(0 0% 0 0)",
          opacity: 1,
          duration: 1,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "expo.out",
          scrollTrigger: {
            trigger: subtitleRef.current,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      );

      const cards = cardsRef.current.filter(Boolean);
      gsap.set(cards, { opacity: 0, rotateX: -20, y: 60, scale: 0.9 });

      ScrollTrigger.batch(cards, {
        onEnter: (batch) => {
          gsap.to(batch, {
            opacity: 1,
            rotateX: 0,
            y: 0,
            scale: 1,
            duration: 1.2,
            stagger: 0.1,
            ease: "power4.out",
          });
        },
        start: "top 90%",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="projectos"
      ref={sectionRef}
      className="py-16 sm:py-20 px-4 sm:px-6"
      style={{ perspective: "1200px" }}
    >
      <div className="max-w-6xl mx-auto">
        <h2 ref={headingRef} className="text-2xl sm:text-3xl font-bold text-center mb-4">
          {t.projects.title}
        </h2>
        <p ref={subtitleRef} className="text-muted text-center mb-12 max-w-xl mx-auto">
          {t.projects.subtitle}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {projects.map((project, i) => (
            <div
              key={project.slug}
              ref={(el) => { cardsRef.current[i] = el; }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
