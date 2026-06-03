"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";

import type { Fundraiser, Scene } from "@/lib/data";
import { WorldGrow } from "@/components/shared/world-grow";

export interface ScrollyStoryProps {
  f: Fundraiser;
  intensity?: number;
}

/** Pinned scrollytelling: the world stays full-screen while story beats cross-fade. */
export function ScrollyStory({ f, intensity = 1 }: ScrollyStoryProps) {
  const scenes: Scene[] =
    f.scenes && f.scenes.length ? f.scenes : (f.story || []).map((p) => ({ sub: p }));
  const wrapRef = useRef<HTMLElement>(null);
  const [prog, setProg] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = wrapRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const total = el.offsetHeight - window.innerHeight;
        const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
        setProg(p);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const n = scenes.length;
  const f01 = prog * (n - 1);
  const worldProgress = Math.min(1, 0.12 + prog * 0.9);
  const activeIdx = Math.round(f01);

  return (
    <section className="scrolly" ref={wrapRef} style={{ height: `${n * 100}vh` }}>
      <div className="scrolly-stage">
        <div className="scrolly-world">
          <div
            className="scrolly-bg"
            style={{
              background: `radial-gradient(130% 85% at 50% 128%, oklch(0.36 0.1 ${f.accent} / .6), transparent 56%), radial-gradient(90% 60% at 50% -10%, oklch(0.26 0.05 264 / .8), transparent 60%), linear-gradient(to bottom, oklch(0.15 0.02 263), oklch(0.1 0.015 265))`,
            }}
          />
          <WorldGrow progress={worldProgress} intensity={intensity * 1.3} accent={f.accent} />
          <div className="scrolly-scrim" />
        </div>

        {scenes.map((s, i) => {
          const d = f01 - i;
          const opacity = Math.max(0, 1 - Math.abs(d) / 0.6);
          const y = d * -46;
          const blur = Math.min(6, Math.abs(d) * 7);
          return (
            <div
              key={i}
              className="sscene"
              style={{ opacity, transform: `translateY(${y}px)`, filter: `blur(${blur}px)` }}
            >
              {s.kicker && <div className="sscene-kicker">{s.kicker}</div>}
              {s.big && <h2 className="sscene-big">{s.big}</h2>}
              {s.sub && <p className="sscene-sub">{s.sub}</p>}
            </div>
          );
        })}

        <div className="scrolly-rail">
          {scenes.map((s, i) => (
            <span
              key={i}
              className={"srail-tick " + (activeIdx === i ? "on" : "")}
              style={{ "--hue": f.accent } as CSSProperties}
            />
          ))}
        </div>

        <div className="scrolly-cue" style={{ opacity: prog < 0.035 ? 0.7 : 0 }}>
          scroll the story ↓
        </div>
        <div
          className="scrolly-name"
          style={{
            opacity:
              prog < 0.035
                ? 0
                : Math.min(1, (prog - 0.02) * 6) * (prog > 0.96 ? Math.max(0, (1 - prog) * 25) : 1),
          }}
        >
          {f.worldName}
        </div>
      </div>
    </section>
  );
}
