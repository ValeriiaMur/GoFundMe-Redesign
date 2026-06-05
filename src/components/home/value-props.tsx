"use client";

import type { CSSProperties } from "react";

import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

const PROPS = [
  { n: "01", label: "Raise", h: "Powerful tools to help you raise money" },
  { n: "02", label: "Share", h: "Easily share your need with potential supporters" },
  { n: "03", label: "Receive", h: "Secure payment methods to receive your money" },
] as const;

/** Three movements on a light band: Raise → Share → Receive. */
export function ValueProps() {
  const [ref, inView] = useInView<HTMLElement>();
  return (
    <section className={cn("vprops", inView && "in")} ref={ref}>
      <ol className="vprops-row">
        {PROPS.map((p, i) => (
          <li className="vprop" style={{ "--i": i } as CSSProperties} key={p.n}>
            <span className="vprop-line" aria-hidden>
              <i />
            </span>
            <span className="vprop-n">{p.n}</span>
            <span className="vprop-label">{p.label}</span>
            <h3 className="vprop-h">{p.h}</h3>
          </li>
        ))}
      </ol>
    </section>
  );
}
