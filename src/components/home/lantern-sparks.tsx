import type { CSSProperties } from "react";

/** Fourteen golden particles drifting up through the hero (decorative). */
export function LanternSparks() {
  return (
    <div className="lhero-particles" aria-hidden>
      {Array.from({ length: 14 }).map((_, i) => {
        const left = (i * 7.1 + (i % 3) * 5) % 100;
        const size = 2 + (i % 3);
        const dur = 10 + (i % 5) * 2.6;
        const delay = -((i * 1.9) % 13);
        const drift = (i % 2 ? 1 : -1) * (12 + (i % 4) * 9);
        return (
          <span
            key={i}
            className="lhero-spark"
            style={
              {
                left: `${left}%`,
                width: size,
                height: size,
                "--dur": `${dur}s`,
                "--delay": `${delay}s`,
                "--drift": `${drift}px`,
              } as CSSProperties
            }
          />
        );
      })}
    </div>
  );
}
