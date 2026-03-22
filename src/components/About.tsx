"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "./LanguageProvider";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const parasRef = useRef<(HTMLParagraphElement | null)[]>([]);

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

      const paras = parasRef.current.filter(Boolean);
      gsap.set(paras, { opacity: 0, y: 30 });
      ScrollTrigger.batch(paras, {
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.12,
            ease: "power3.out",
          }),
        start: "top 88%",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <h2
          ref={headingRef}
          className="text-xl sm:text-3xl font-bold text-center mb-10 sm:mb-14"
        >
          {t.about.title}
        </h2>

        <div className="relative pl-5 sm:pl-7 border-l-2 border-[#c8a44e]/30 space-y-6 sm:space-y-8">
          {/* Gold top dot */}
          <span className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-[#c8a44e] opacity-70" />
          {/* Gold bottom dot */}
          <span className="absolute -left-[5px] bottom-0 w-2.5 h-2.5 rounded-full bg-[#c8a44e] opacity-30" />

          {t.about.paragraphs.map((html, i) => (
            <p
              key={i}
              ref={(el) => { parasRef.current[i] = el; }}
              className="text-sm sm:text-base leading-relaxed text-foreground/80
                [&_strong]:text-[#c8a44e] [&_strong]:font-semibold [&_em]:italic [&_em]:text-foreground/70"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
