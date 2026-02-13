"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "./LanguageProvider";

gsap.registerPlugin(ScrollTrigger);

const contactLinks = [
  {
    href: "mailto:miguelalvaro13@gmail.com",
    label: "Email",
    external: false,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
  {
    href: "https://github.com/gdlf13",
    label: "GitHub",
    external: true,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    href: "https://www.linkedin.com/in/miguel-oliveira-8b7301125",
    label: "LinkedIn",
    external: true,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    href: "https://orcid.org/0000-0002-8176-3100",
    label: "ORCID",
    external: true,
    icon: (
      <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor">
        <path d="M128,0C57.3,0,0,57.3,0,128s57.3,128,128,128s128-57.3,128-128S198.7,0,128,0z M86.3,186.2H70.9V79.1h15.4V186.2z M78.6,70.6c-5.7,0-10.3-4.6-10.3-10.3c0-5.7,4.6-10.3,10.3-10.3c5.7,0,10.3,4.6,10.3,10.3C88.9,66,84.3,70.6,78.6,70.6z M180.3,186.2h-15.4v-52.4c0-13.1-0.2-30-18.3-30c-18.3,0-21.1,14.3-21.1,29.1v53.4h-15.4V79.1h14.8v14.6h0.2c5.6-10.6,19.3-21.8,39.7-21.8c42.5,0,50.3,28,50.3,64.3V186.2z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const { t } = useLanguage();
  const footerRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);

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
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );

      const links = linksRef.current.filter(Boolean);
      gsap.set(links, { opacity: 0, y: 20, scale: 0.9 });

      ScrollTrigger.batch(links, {
        onEnter: (batch) => {
          gsap.to(batch, {
            opacity: 1, y: 0, scale: 1,
            duration: 0.8, stagger: 0.1, ease: "back.out(1.5)",
          });
        },
        start: "top 95%",
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} id="contacto" className="relative border-t border-card-border py-16 sm:py-20 px-4 sm:px-6 overflow-hidden">
      {/* Background accent glow */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full"
        style={{
          background: "radial-gradient(ellipse, var(--accent) 0%, transparent 70%)",
          filter: "blur(120px)",
          opacity: 0.06,
        }}
      />

      <div className="relative max-w-4xl mx-auto text-center">
        <h2 ref={headingRef} className="text-2xl sm:text-3xl font-bold mb-10">
          {t.footer.title}
        </h2>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5 mb-12"
          style={{ perspective: "800px" }}
        >
          {contactLinks.map((link, i) => (
            <a
              key={link.href}
              ref={(el) => { linksRef.current[i] = el; }}
              href={link.href}
              {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group relative inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl
                border border-card-border bg-card
                text-sm font-semibold hover:border-accent/50 hover:text-accent
                hover:shadow-xl hover:shadow-accent/10 hover:scale-105 hover:-translate-y-1
                transition-all duration-300 min-h-[48px] overflow-hidden"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Hover gradient bg */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent
                opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[inherit]" />
              <span className="relative group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                {link.icon}
              </span>
              <span className="relative">{link.label}</span>
            </a>
          ))}
        </div>

        <p className="text-sm text-muted">
          &copy; {new Date().getFullYear()} Miguel Oliveira
        </p>
      </div>
    </footer>
  );
}
