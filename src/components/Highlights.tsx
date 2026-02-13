"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "./LanguageProvider";
import Tilt3D from "./Tilt3D";

gsap.registerPlugin(ScrollTrigger);

const icons = [
  <svg key="0" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>,
  <svg key="1" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>,
  <svg key="2" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a10 10 0 0 1 0 20 10 10 0 0 1 0-20z" />
    <path d="M12 6v6l4 2" />
  </svg>,
  <svg key="3" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>,
];

const gradients = [
  "from-blue-500/20 to-cyan-500/20 dark:from-blue-500/10 dark:to-cyan-500/10",
  "from-purple-500/20 to-pink-500/20 dark:from-purple-500/10 dark:to-pink-500/10",
  "from-amber-500/20 to-orange-500/20 dark:from-amber-500/10 dark:to-orange-500/10",
  "from-teal-500/20 to-emerald-500/20 dark:from-teal-500/10 dark:to-emerald-500/10",
];

const iconBgColors = [
  "bg-blue-500/15 text-blue-600 dark:bg-blue-400/15 dark:text-blue-400",
  "bg-purple-500/15 text-purple-600 dark:bg-purple-400/15 dark:text-purple-400",
  "bg-amber-500/15 text-amber-600 dark:bg-amber-400/15 dark:text-amber-400",
  "bg-teal-500/15 text-teal-600 dark:bg-teal-400/15 dark:text-teal-400",
];

export default function Highlights() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
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

      const cards = cardsRef.current.filter(Boolean);
      gsap.set(cards, { opacity: 0, y: 60, rotateX: -25, scale: 0.9 });

      ScrollTrigger.batch(cards, {
        onEnter: (batch) => {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            rotateX: 0,
            scale: 1,
            duration: 1.2,
            stagger: 0.15,
            ease: "power4.out",
          });
        },
        start: "top 88%",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 sm:py-24 px-4 sm:px-6" style={{ perspective: "1200px" }}>
      <div className="max-w-5xl mx-auto">
        <h2 ref={headingRef} className="text-2xl sm:text-3xl font-bold text-center mb-14">
          {t.highlights.title}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          {t.highlights.items.map((text, i) => (
            <div
              key={i}
              ref={(el) => { cardsRef.current[i] = el; }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <Tilt3D intensity={8} className="h-full rounded-2xl">
                <div
                  className={`relative h-full p-6 sm:p-7 rounded-2xl border border-card-border bg-gradient-to-br ${gradients[i]}
                    backdrop-blur-sm overflow-hidden group cursor-default`}
                >
                  {/* Decorative corner accent */}
                  <div className="absolute top-0 right-0 w-24 h-24 opacity-30 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 100% 0%, var(--accent) 0%, transparent 70%)`,
                    }}
                  />

                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl ${iconBgColors[i]} flex items-center justify-center mb-5
                    group-hover:scale-110 transition-transform duration-300 shadow-sm`}
                    style={{ transform: "translateZ(30px)" }}
                  >
                    {icons[i]}
                  </div>

                  {/* Text */}
                  <p
                    className="text-base sm:text-lg font-semibold leading-relaxed"
                    style={{ transform: "translateZ(20px)" }}
                  >
                    {text}
                  </p>

                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent
                    group-hover:via-accent/60 transition-all duration-500" />
                </div>
              </Tilt3D>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
