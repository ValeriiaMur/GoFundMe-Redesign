"use client";

import { type CSSProperties, useEffect, useState } from "react";

import type { ConstellationNode } from "@/lib/data";
import { fixed, seeded } from "@/lib/seeded";
import { cn } from "@/lib/utils";

export interface ConstellationProps {
  nodes: ConstellationNode[];
  onSelect: (node: { id: string; kind: "fundraiser" | "community" }) => void;
  variant?: "card" | "hero";
}

/** Animated star-map of every cause a person keeps watch over. */
export function Constellation({ nodes, onSelect, variant = "card" }: ConstellationProps) {
  const [hover, setHover] = useState<string | null>(null);
  const [lit, setLit] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLit(true), 120);
    return () => clearTimeout(t);
  }, []);

  const lines: Array<{ a: ConstellationNode; b: ConstellationNode; k: string; idx: number }> = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i];
      const b = nodes[j];
      if (Math.hypot(a.x - b.x, a.y - b.y) < 38) {
        lines.push({ a, b, k: `${i}-${j}`, idx: lines.length });
      }
    }
  }

  return (
    <div className={cn("constel", variant, lit && "lit")}>
      <div className="constel-drift">
        <svg className="constel-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
          {lines.map((l) => (
            <line
              key={l.k}
              x1={l.a.x}
              y1={l.a.y}
              x2={l.b.x}
              y2={l.b.y}
              pathLength="1"
              className="cline"
              style={{ animationDelay: `${0.3 + l.idx * 0.22}s` }}
            />
          ))}
        </svg>
        {Array.from({ length: 54 }).map((_, i) => (
          <span
            key={i}
            className="bgstar"
            style={
              {
                left: `${fixed(seeded(i) * 100)}%`,
                top: `${fixed(seeded(i + 50) * 100)}%`,
                "--o": (0.12 + seeded(i + 9) * 0.5).toFixed(2),
                animationDelay: `${fixed(-seeded(i) * 4)}s`,
                width: `${fixed(1 + seeded(i + 3) * 1.7)}px`,
                height: `${fixed(1 + seeded(i + 3) * 1.7)}px`,
              } as CSSProperties
            }
          />
        ))}
        {nodes.map((n, i) => (
          <button
            key={n.id}
            className={cn("cnode", hover === n.id && "on", n.kind === "community" && "is-community")}
            style={
              {
                left: `${n.x}%`,
                top: `${n.y}%`,
                "--s": n.size,
                "--hue": n.accent,
                transitionDelay: `${0.15 + i * 0.12}s`,
              } as CSSProperties
            }
            onMouseEnter={() => setHover(n.id)}
            onMouseLeave={() => setHover(null)}
            onClick={() => onSelect({ id: n.id, kind: n.kind })}
          >
            <span className="cnode-halo" />
            {n.kind === "community" && <span className="cnode-ring" />}
            <span className="cnode-core" />
            <span className="cnode-label">
              <b>{n.label}</b>
              <span>{n.role}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
