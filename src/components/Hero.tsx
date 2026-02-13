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
  const orbitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(photoRef.current, { opacity: 0, scale: 0.3, rotateY: -45 });
      gsap.set(nameRef.current, { opacity: 0, y: 80, rotateX: -50 });
      gsap.set(taglineRef.current, { opacity: 0, y: 40, filter: "blur(10px)" });
      gsap.set(ctaRef.current, { opacity: 0, y: 40, scale: 0.8 });
      gsap.set(glowRef.current, { opacity: 0, scale: 0.3 });
      gsap.set(glow2Ref.current, { opacity: 0, scale: 0.3 });
      gsap.set(scrollRef.current, { opacity: 0 });
      gsap.set(orbitRef.current, { opacity: 0, scale: 0.5, rotation: -90 });

      const tl = gsap.timeline({ delay: 0.2 });

      // Dual glow orbs
      tl.to(glowRef.current, {
        opacity: 1, scale: 1, duration: 2.5, ease: "power2.out",
      }, 0);
      tl.to(glow2Ref.current, {
        opacity: 1, scale: 1, duration: 2.5, ease: "power2.out",
      }, 0.3);

      // Orbit ring
      tl.to(orbitRef.current, {
        opacity: 1, scale: 1, rotation: 0, duration: 1.8, ease: "power4.out",
      }, 0.2);

      // Photo entrance
      tl.to(photoRef.current, {
        opacity: 1, scale: 1, rotateY: 0, duration: 1.4, ease: "power4.out",
      }, 0.3);

      // Name reveal
      tl.to(nameRef.current, {
        opacity: 1, y: 0, rotateX: 0, duration: 1.4, ease: "power4.out",
      }, 0.6);

      // Tagline with blur removal
      tl.to(taglineRef.current, {
        opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2, ease: "expo.out",
      }, 0.9);

      // CTAs bounce in
      tl.to(ctaRef.current, {
        opacity: 1, y: 0, scale: 1, duration: 1, ease: "elastic.out(1, 0.6)",
      }, 1.1);

      // Scroll indicator
      tl.to(scrollRef.current, {
        opacity: 1, duration: 1, ease: "power2.out",
      }, 1.6);

      // Continuous orbit rotation
      gsap.to(orbitRef.current, {
        rotation: 360,
        duration: 30,
        repeat: -1,
        ease: "none",
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 pt-24 pb-16 overflow-hidden"
      style={{ perspective: "1000px" }}
    >
      {/* Ambient glow orb 1 */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute top-1/3 left-1/3 w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(ellipse, var(--accent) 0%, transparent 70%)",
          filter: "blur(100px)",
          opacity: 0.12,
        }}
      />
      {/* Ambient glow orb 2 */}
      <div
        ref={glow2Ref}
        className="pointer-events-none absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full"
        style={{
          background: "radial-gradient(ellipse, #8b5cf6 0%, transparent 70%)",
          filter: "blur(100px)",
          opacity: 0.08,
        }}
      />

      <div className="relative max-w-3xl mx-auto text-center">
        {/* Profile photo with orbiting ring */}
        <div className="mb-10 flex justify-center" style={{ perspective: "800px" }}>
          <div className="relative">
            {/* Orbit ring */}
            <div
              ref={orbitRef}
              className="absolute inset-[-20px] sm:inset-[-24px] rounded-full border border-accent/20 pointer-events-none"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-accent/60 shadow-lg shadow-accent/30" />
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-accent/40" />
              <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 rounded-full bg-accent/30" />
            </div>

            <Tilt3D intensity={15} className="rounded-full">
              <div
                ref={photoRef}
                className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden
                  ring-4 ring-accent/30 shadow-2xl shadow-accent/20"
                style={{ transformStyle: "preserve-3d" }}
              >
                <Image
                  src="/images/profile.png"
                  alt="Foto de Miguel Oliveira"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </Tilt3D>
          </div>
        </div>

        {/* Name */}
        <h1
          ref={nameRef}
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-5"
          style={{ transformStyle: "preserve-3d" }}
        >
          Miguel <span className="text-accent">Oliveira</span>
        </h1>

        {/* Tagline */}
        <p ref={taglineRef} className="text-lg sm:text-xl text-muted mb-12 font-medium">
          {t.hero.tagline}
        </p>

        {/* CTAs */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/cv/CV_MiguelOliveira_2026.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-2 px-8 py-3.5 bg-accent text-white rounded-full
              font-semibold text-base transition-all duration-300
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
            className="group inline-flex items-center gap-2 px-8 py-3.5 border-2 border-card-border rounded-full
              font-semibold text-base hover:border-accent hover:text-accent transition-all duration-300
              hover:scale-105 hover:shadow-lg hover:shadow-accent/10 min-h-[44px]"
          >
            {t.hero.projectsButton}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-y-1 transition-transform duration-300">
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="19 12 12 19 5 12" />
            </svg>
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div ref={scrollRef} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-xs text-muted font-medium tracking-widest uppercase">{t.hero.scroll}</span>
        <div className="w-px h-10 bg-gradient-to-b from-accent/50 to-transparent relative overflow-hidden">
          <div
            className="absolute w-1.5 h-1.5 rounded-full bg-accent -left-[2px]"
            style={{ animation: "scrollDotMove 2s ease-in-out infinite" }}
          />
        </div>
      </div>
    </section>
  );
}
