import { seeded, lerp, fixed } from "@/lib/seeded";

export interface WorldGrowProps {
  /** 0–1 funding progress; more progress = more lanterns + glow. */
  progress?: number;
  intensity?: number;
  accent?: number;
  dense?: boolean;
}

/** Drifting lanterns + glow that bloom as a cause's funding grows. */
export function WorldGrow({ progress = 0, intensity = 1, accent = 52, dense = true }: WorldGrowProps) {
  const base = dense ? 26 : 14;
  const count = Math.max(3, Math.round(lerp(4, base, progress) * intensity));
  const lanterns = Array.from({ length: count }, (_, i) => {
    const r1 = seeded(i + 1);
    const r2 = seeded(i + 7);
    const r3 = seeded(i + 13);
    const r4 = seeded(i + 19);
    const size = fixed(3 + r2 * 6);
    const hue = fixed(accent + (r3 - 0.5) * 26);
    return (
      <span
        key={i}
        className="lantern"
        style={{
          left: `${fixed(r1 * 100)}%`,
          width: `${size}px`,
          height: `${size}px`,
          background: `radial-gradient(circle at 40% 35%, oklch(0.92 0.13 ${hue}), oklch(0.74 0.16 ${hue}) 55%, transparent 72%)`,
          animationDuration: `${fixed(9 + r4 * 10)}s`,
          animationDelay: `${fixed(-r3 * 16)}s`,
        }}
      />
    );
  });

  return (
    <div className="world-grow" aria-hidden>
      <div
        className="world-grow-glow"
        style={{
          opacity: fixed(lerp(0.12, 0.5, progress) * intensity),
          background: `radial-gradient(120% 80% at 50% 116%, oklch(0.78 0.16 ${accent} / 0.9), transparent 60%)`,
        }}
      />
      {lanterns}
    </div>
  );
}
