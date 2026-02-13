"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import LanguageToggle from "./LanguageToggle";
import { useLanguage } from "./LanguageProvider";

export default function Header() {
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const navItemsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  const links = [
    { href: "#projectos", label: t.nav.projects },
    { href: "/cv/CV_MiguelOliveira_2026.pdf", label: t.nav.cv, external: true },
    { href: "#contacto", label: t.nav.contact },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(headerRef.current, { y: -80, opacity: 0 });
      gsap.set(logoRef.current, { opacity: 0, x: -20 });

      const tl = gsap.timeline({ delay: 0.1 });

      tl.to(headerRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power4.out",
      });

      tl.to(logoRef.current, {
        opacity: 1,
        x: 0,
        duration: 0.6,
        ease: "expo.out",
      }, "-=0.4");

      const items = navItemsRef.current.filter(Boolean);
      gsap.set(items, { opacity: 0, y: -10 });
      tl.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: "power3.out",
      }, "-=0.3");
    });

    return () => ctx.revert();
  }, []);

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-card-border"
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <a ref={logoRef} href="#" className="font-semibold text-lg tracking-tight hover:opacity-80 transition-opacity">
          Miguel <span className="text-accent">Oliveira</span>
        </a>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-6">
          {links.map((link, i) => (
            <a
              key={link.href}
              ref={(el) => { navItemsRef.current[i] = el; }}
              href={link.href}
              {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="relative text-sm font-medium text-muted hover:text-foreground transition-colors
                after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-accent
                after:transition-all after:duration-300 hover:after:w-full"
            >
              {link.label}
            </a>
          ))}
          <LanguageToggle />
        </div>

        {/* Mobile menu button + toggles */}
        <div className="flex sm:hidden items-center gap-1">
          <LanguageToggle />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-foreground/10 transition-colors"
          >
            {menuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden bg-background/95 backdrop-blur-md border-b border-card-border px-4 pb-4">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              onClick={() => setMenuOpen(false)}
              className="block py-3 text-base font-medium text-muted hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
