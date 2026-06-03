"use client";

import { type ReactNode } from "react";

import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

export interface RevealProps {
  children: ReactNode;
  /** Stagger, in ms, applied as a transition-delay once the element enters view. */
  delay?: number;
  className?: string;
}

/** Fades + lifts its children into place the first time they scroll into view. */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const [ref, inView] = useInView<HTMLDivElement>({ rootMargin: "-48px" });
  return (
    <div
      ref={ref}
      className={cn("reveal", inView && "in", className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
