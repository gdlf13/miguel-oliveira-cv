"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getScenes } from "@/data/scrollWorld";
import { SEG, activeIndex, copyWeight, totalScreens } from "@/lib/world3d/timeline";
import { useLanguage } from "./LanguageProvider";

const FADE_SVH = 45; // altura do escurecimento final (tem de coincidir com .sw3__fade em globals.css)

type World = { setProgress(p: number): void; jump(p: number): void; destroy(): void };
type WorldModule = { mountWorld(el: HTMLElement, o: { reduced?: boolean; onReady?: () => void }): World };

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Voo 3D pelo meu trabalho: um mundo three.js (6 ilhas-maquete ligadas por um fio vermelhão) cuja câmara
 * é controlada pelo scroll. O canvas fica "sticky" durante todo o bloco; o texto de cada cena é DOM real.
 * O módulo do mundo (three.js) só é descarregado no cliente, depois da 1.ª pintura.
 */
export default function ScrollWorld3D() {
  const { locale } = useLanguage();
  const scenes = getScenes(locale);
  const rootRef = useRef<HTMLElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<World | null>(null);
  const sceneEls = useRef<(HTMLElement | null)[]>([]);
  const hintRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const modeRef = useRef<"loading" | "webgl" | "static">("loading");
  const [mode, setMode] = useState<"loading" | "webgl" | "static">("loading");
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(0);

  const measure = useCallback(() => {
    const el = rootRef.current;
    if (!el) return 0;
    const r = el.getBoundingClientRect();
    // o "fade" final fica fora do intervalo do voo: só entra depois de u = 1, para não escurecer o último texto/CTA
    const range = Math.max(1, r.height - window.innerHeight - (fadeRef.current?.offsetHeight ?? 0));
    return Math.min(1, Math.max(0, -r.top / range));
  }, []);

  const apply = useCallback((u: number) => {
    if (modeRef.current === "static") return;
    worldRef.current?.setProgress(u);
    SEG.forEach((s, i) => {
      const el = sceneEls.current[i];
      if (!el) return;
      const w = copyWeight(i, u), dir = u < s.mid ? 1 : -1;
      el.style.opacity = w.toFixed(3);
      el.style.transform = `translate3d(0, ${((1 - w) * dir * 26).toFixed(1)}px, 0)`;
      el.style.visibility = w < 0.01 ? "hidden" : "visible";
      el.style.pointerEvents = w > 0.6 ? "auto" : "none";
    });
    if (hintRef.current) hintRef.current.style.opacity = u < 0.02 ? "1" : "0";
    const a = activeIndex(u);
    setActive((prev) => (prev === a ? prev : a));
  }, []);

  // monta o mundo 3D (fora da 1.ª pintura; cancela-se se o componente remontar durante a hidratação)
  useEffect(() => {
    let cancelled = false;
    let world: World | null = null;
    const timer = window.setTimeout(async () => {
      if (cancelled) return;
      if (!hasWebGL()) { modeRef.current = "static"; setMode("static"); return; }
      try {
        const mod = (await import("@/lib/world3d/index")) as unknown as WorldModule;
        if (cancelled || !hostRef.current) return;
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        world = mod.mountWorld(hostRef.current, { reduced, onReady: () => !cancelled && setReady(true) });
        worldRef.current = world;
        modeRef.current = "webgl"; setMode("webgl");
        const u = measure();
        world.jump(u); apply(u);
      } catch (e) {
        console.warn("[ScrollWorld3D] WebGL indisponível, a usar versão estática", e);
        modeRef.current = "static"; setMode("static");
      }
    }, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      world?.destroy();
      worldRef.current = null;
    };
  }, [apply, measure]);

  // scroll -> progresso (aplicado logo no evento, sem depender do requestAnimationFrame)
  useEffect(() => {
    let lastU = -1;
    const onScroll = () => { const u = measure(); if (u !== lastU) { lastU = u; apply(u); } };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const poll = window.setInterval(onScroll, 250);
    onScroll();
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); window.clearInterval(poll); };
  }, [apply, measure]);

  const goTo = (i: number) => {
    const el = rootRef.current;
    if (!el) return;
    const top = window.scrollY + el.getBoundingClientRect().top;
    const range = Math.max(1, el.offsetHeight - window.innerHeight - (fadeRef.current?.offsetHeight ?? 0));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: top + SEG[i].mid * range, behavior: reduced ? "auto" : "smooth" });
  };

  const isStatic = mode === "static";
  const pt = locale === "pt";

  return (
    <section
      id="inicio"
      ref={rootRef}
      aria-label={pt ? "Voo pelo meu trabalho" : "A flight through my work"}
      className={`sw3${isStatic ? " is-static" : ""}${ready ? " is-ready" : ""}`}
      style={isStatic ? undefined : { height: `${(totalScreens * 100 + FADE_SVH).toFixed(0)}svh` }}
    >
      <h1 className="sr-only">Miguel Oliveira — {pt ? "Compreender pessoas. Construir futuro." : "Understand people. Build the future."}</h1>

      <div className="sw3__stage">
        <div className="sw3__sky" aria-hidden="true" />
        <div ref={hostRef} className="sw3__canvas" aria-hidden="true" />
        <div className="sw3__veil" aria-hidden="true" />

        {scenes.map((s, i) => (
          <article
            key={s.id}
            ref={(el) => { sceneEls.current[i] = el; }}
            className="sw3__copy"
            style={i === 0 ? undefined : { opacity: 0, visibility: "hidden" }}
            aria-labelledby={`sw3-t-${s.id}`}
          >
            <p className="sw3__eyebrow">{s.eyebrow}</p>
            <h2 id={`sw3-t-${s.id}`} className="sw3__title">{s.title}</h2>
            <p className="sw3__body">{s.body}</p>
            {s.tags.length > 0 && (
              <ul className="sw3__tags">{s.tags.map((t) => <li key={t}>{t}</li>)}</ul>
            )}
            {s.cta && (
              <div className="sw3__cta">
                <a className="sw3__btn sw3__btn--primary" href={s.cta.primary.href}>{s.cta.primary.label}</a>
                <a className="sw3__btn" href={s.cta.secondary.href} target="_blank" rel="noreferrer">{s.cta.secondary.label}</a>
              </div>
            )}
          </article>
        ))}

        {!isStatic && (
          <nav className="sw3__rail" aria-label={pt ? "Cenas" : "Scenes"}>
            {scenes.map((s, i) => (
              <button key={s.id} type="button" className={`sw3__dot${active === i ? " is-active" : ""}`} onClick={() => goTo(i)} aria-label={s.label} aria-current={active === i ? "true" : undefined}>
                <span className="sw3__dot-label">{s.label}</span>
              </button>
            ))}
          </nav>
        )}

        {!isStatic && (
          <div ref={hintRef} className="sw3__hint" aria-hidden="true">
            <span>{pt ? "desliza para voar" : "scroll to fly"}</span>
            <i />
          </div>
        )}
      </div>

      {!isStatic && <div ref={fadeRef} className="sw3__fade" aria-hidden="true" />}
    </section>
  );
}
