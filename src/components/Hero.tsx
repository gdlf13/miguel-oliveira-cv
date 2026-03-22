"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useLanguage } from "./LanguageProvider";
import Tilt3D from "./Tilt3D";

export default function Hero() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const glow2Ref = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(nameRef.current, { opacity: 0, y: 60, rotateX: -40 });
      gsap.set(taglineRef.current, { opacity: 0, y: 30, filter: "blur(10px)" });
      gsap.set(frameRef.current, { opacity: 0, scale: 0.7, rotateY: -30 });
      gsap.set(photoRef.current, { opacity: 0, scale: 0.5 });
      gsap.set(ctaRef.current, { opacity: 0, y: 40, scale: 0.8 });
      gsap.set(glowRef.current, { opacity: 0, scale: 0.3 });
      gsap.set(glow2Ref.current, { opacity: 0, scale: 0.3 });
      gsap.set(scrollRef.current, { opacity: 0 });

      const tl = gsap.timeline({ delay: 0.2 });

      // Name reveal first (it's on top now)
      tl.to(nameRef.current, {
        opacity: 1, y: 0, rotateX: 0, duration: 1.4, ease: "power4.out",
      }, 0);

      // Tagline with blur removal
      tl.to(taglineRef.current, {
        opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2, ease: "expo.out",
      }, 0.3);

      // Dual glow orbs
      tl.to(glowRef.current, {
        opacity: 1, scale: 1, duration: 2.5, ease: "power2.out",
      }, 0.2);
      tl.to(glow2Ref.current, {
        opacity: 1, scale: 1, duration: 2.5, ease: "power2.out",
      }, 0.5);

      // Frame entrance
      tl.to(frameRef.current, {
        opacity: 1, scale: 1, rotateY: 0, duration: 1.6, ease: "power4.out",
      }, 0.4);

      // Photo entrance
      tl.to(photoRef.current, {
        opacity: 1, scale: 1, duration: 1.4, ease: "power4.out",
      }, 0.6);

      // CTAs bounce in
      tl.to(ctaRef.current, {
        opacity: 1, y: 0, scale: 1, duration: 1, ease: "elastic.out(1, 0.6)",
      }, 1.0);

      // Scroll indicator
      tl.to(scrollRef.current, {
        opacity: 1, duration: 1, ease: "power2.out",
      }, 1.4);

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 pt-20 sm:pt-24 pb-24 sm:pb-32 overflow-hidden"
      style={{ perspective: "1000px" }}
    >
      {/* Ambient glow orb 1 — behind photo */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full"
        style={{
          background: "radial-gradient(ellipse, rgba(255,255,255,0.08) 0%, transparent 60%)",
          filter: "blur(80px)",
        }}
      />
      {/* Ambient glow orb 2 — subtle accent */}
      <div
        ref={glow2Ref}
        className="pointer-events-none absolute top-[40%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(ellipse, var(--accent) 0%, transparent 70%)",
          filter: "blur(120px)",
          opacity: 0.06,
        }}
      />

      <div className="relative max-w-3xl mx-auto text-center flex flex-col items-center">
        {/* Name — on top */}
        <h1
          ref={nameRef}
          className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-2 sm:mb-4"
          style={{ transformStyle: "preserve-3d", fontStyle: "italic" }}
        >
          Miguel Oliveira
        </h1>

        {/* Tagline */}
        <p ref={taglineRef} className="text-sm sm:text-lg text-muted mb-6 sm:mb-10 font-medium tracking-wide">
          {t.hero.tagline}
        </p>

        {/* Profile photo — large square with glowing frame */}
        <div className="mb-6 sm:mb-10 flex justify-center" style={{ perspective: "800px" }}>
          <Tilt3D intensity={10} className="rounded-2xl">
            <div
              ref={frameRef}
              className="relative p-[3px] rounded-2xl"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0.1) 100%)",
                boxShadow: "0 0 60px rgba(255,255,255,0.06), 0 0 120px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.1)",
                transformStyle: "preserve-3d",
              }}
            >
              <div
                ref={photoRef}
                className="relative w-44 h-44 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-2xl overflow-hidden bg-card"
              >
                <Image
                  src="/images/profile.png"
                  alt="Foto de Miguel Oliveira"
                  fill
                  className="object-cover"
                  priority
                />
                {/* Bottom fade for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </div>
            </div>
          </Tilt3D>
        </div>

        {/* CTAs */}
        <div ref={ctaRef} className="flex flex-row items-center justify-center gap-3 sm:gap-4">
          <a
            href="/cv/CV_MiguelOliveira_2026.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-2 px-5 sm:px-8 py-3 sm:py-3.5 bg-accent text-white rounded-full
              font-semibold text-sm sm:text-base transition-all duration-300
              shadow-lg shadow-accent/25 hover:shadow-2xl hover:shadow-accent/40 hover:scale-105
              min-h-[44px] overflow-hidden"
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700
              bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-6 transition-transform duration-300">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            {t.hero.cvButton}
          </a>
          <a
            href="#projectos"
            className="group inline-flex items-center gap-2 px-5 sm:px-8 py-3 sm:py-3.5 border border-card-border rounded-full
              font-semibold text-sm sm:text-base hover:border-accent hover:text-accent transition-all duration-300
              hover:scale-105 hover:shadow-lg hover:shadow-accent/10 min-h-[44px]"
          >
            {t.hero.projectsButton}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform duration-300">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div ref={scrollRef} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-xs text-muted font-medium tracking-widest uppercase">{t.hero.scroll}</span>
        <div className="w-px h-10 bg-gradient-to-b from-muted/50 to-transparent relative overflow-hidden">
          <div
            className="absolute w-1.5 h-1.5 rounded-full bg-muted -left-[2px]"
            style={{ animation: "scrollDotMove 2s ease-in-out infinite" }}
          />
        </div>
      </div>
    </section>
  );
}
