"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "./LanguageProvider";
import Tilt3D from "./Tilt3D";

gsap.registerPlugin(ScrollTrigger);

const icons = [
  // Research / Book icon
  <svg key="0" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c8a44e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    <circle cx="7" cy="8" r="1.5" fill="#c8a44e" stroke="none" />
  </svg>,
  // AI / Network icon
  <svg key="1" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c8a44e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <circle cx="4" cy="6" r="2" />
    <circle cx="20" cy="6" r="2" />
    <circle cx="4" cy="18" r="2" />
    <circle cx="20" cy="18" r="2" />
    <line x1="9.5" y1="10.5" x2="5.5" y2="7.5" />
    <line x1="14.5" y1="10.5" x2="18.5" y2="7.5" />
    <line x1="9.5" y1="13.5" x2="5.5" y2="16.5" />
    <line x1="14.5" y1="13.5" x2="18.5" y2="16.5" />
  </svg>,
  // Agents / Bot icon
  <svg key="2" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c8a44e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="14" rx="3" />
    <circle cx="9" cy="11" r="1.5" fill="#c8a44e" stroke="none" />
    <circle cx="15" cy="11" r="1.5" fill="#c8a44e" stroke="none" />
    <path d="M8 21h8" />
    <path d="M12 18v3" />
    <path d="M12 1v3" />
  </svg>,
  // Teaching / People icon
  <svg key="3" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c8a44e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8" />
    <path d="M12 17v4" />
    <circle cx="12" cy="10" r="3" />
  </svg>,
  // Cybersecurity / Shield icon
  <svg key="4" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c8a44e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" stroke="#c8a44e" strokeWidth="2" />
  </svg>,
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
      <div className="max-w-3xl mx-auto">
        <h2 ref={headingRef} className="text-xl sm:text-3xl font-bold text-center mb-10 sm:mb-14">
          {t.highlights.title}
        </h2>

        {/* Honeycomb layout */}
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          {/* Row 1: 3 cells */}
          <div className="flex justify-center gap-3 sm:gap-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                ref={(el) => { cardsRef.current[i] = el; }}
                style={{ transformStyle: "preserve-3d" }}
                className="w-[130px] h-[130px] sm:w-[200px] sm:h-[200px]"
              >
                <Tilt3D intensity={6} className="h-full rounded-2xl">
                  <div
                    className="relative h-full p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-card-border bg-card
                      overflow-hidden group cursor-default transition-all duration-300
                      hover:border-[#c8a44e]/30 flex flex-col items-center justify-center text-center"
                  >
                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-[#c8a44e]/10 border border-[#c8a44e]/20
                      flex items-center justify-center mb-2 sm:mb-3 shrink-0
                      group-hover:scale-110 group-hover:bg-[#c8a44e]/15 transition-all duration-300"
                      style={{ transform: "translateZ(30px)" }}
                    >
                      {icons[i]}
                    </div>
                    <p
                      className="text-[10px] sm:text-xs font-semibold leading-tight text-foreground/90"
                      style={{ transform: "translateZ(20px)" }}
                    >
                      {t.highlights.items[i]}
                    </p>
                  </div>
                </Tilt3D>
              </div>
            ))}
          </div>

          {/* Row 2: 2 cells offset */}
          <div className="flex justify-center gap-3 sm:gap-4 -mt-1 sm:-mt-2">
            {[3, 4].map((i) => (
              <div
                key={i}
                ref={(el) => { cardsRef.current[i] = el; }}
                style={{ transformStyle: "preserve-3d" }}
                className="w-[130px] h-[130px] sm:w-[200px] sm:h-[200px]"
              >
                <Tilt3D intensity={6} className="h-full rounded-2xl">
                  <div
                    className="relative h-full p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-card-border bg-card
                      overflow-hidden group cursor-default transition-all duration-300
                      hover:border-[#c8a44e]/30 flex flex-col items-center justify-center text-center"
                  >
                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-[#c8a44e]/10 border border-[#c8a44e]/20
                      flex items-center justify-center mb-2 sm:mb-3 shrink-0
                      group-hover:scale-110 group-hover:bg-[#c8a44e]/15 transition-all duration-300"
                      style={{ transform: "translateZ(30px)" }}
                    >
                      {icons[i]}
                    </div>
                    <p
                      className="text-[10px] sm:text-xs font-semibold leading-tight text-foreground/90"
                      style={{ transform: "translateZ(20px)" }}
                    >
                      {t.highlights.items[i]}
                    </p>
                  </div>
                </Tilt3D>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
