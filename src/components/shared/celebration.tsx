"use client";

import { useEffect, useState } from "react";

import { seeded } from "@/lib/seeded";

interface Burst {
  id: string;
  lights: Array<{ i: number; left: number; dx: number; dur: number; hue: number }>;
}

export interface CelebrationProps {
  /** A changing value (e.g. timestamp); each change spawns a burst of lights. */
  fire: number | null;
  accent?: number;
}

/** A burst of rising lights when someone plants a light. */
export function Celebration({ fire, accent = 52 }: CelebrationProps) {
  const [bursts, setBursts] = useState<Burst[]>([]);

  useEffect(() => {
    if (fire == null) return;
    const id = `${fire}-${Math.random()}`;
    const lights = Array.from({ length: 18 }, (_, i) => ({
      i,
      left: 30 + seeded(i + fire * 3) * 40,
      dx: (seeded(i + fire) - 0.5) * 120,
      dur: 1.6 + seeded(i) * 1.4,
      hue: accent + (seeded(i + 2) - 0.5) * 40,
    }));
    const raf = requestAnimationFrame(() => setBursts((b) => [...b, { id, lights }]));
    const t = setTimeout(() => setBursts((b) => b.filter((x) => x.id !== id)), 3200);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, [fire, accent]);

  return (
    <div className="celebration" aria-hidden>
      {bursts.map((b) => (
        <div key={b.id}>
          {b.lights.map((l) => (
            <span
              key={l.i}
              className="cel-light"
              style={
                {
                  left: `${l.left}%`,
                  "--dx": `${l.dx}px`,
                  animationDuration: `${l.dur}s`,
                  background: `radial-gradient(circle at 40% 35%, oklch(0.94 0.12 ${l.hue}), oklch(0.76 0.17 ${l.hue}) 55%, transparent 72%)`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      ))}
    </div>
  );
}
