import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface BtnProps {
  children: ReactNode;
  kind?: "primary" | "ghost";
  accent?: number;
  size?: "md" | "lg";
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
}

/** The design's pill button; `accent` drives its hue via CSS variables. */
export function Btn({
  children,
  kind = "primary",
  accent = 52,
  size = "md",
  className = "",
  style,
  onClick,
}: BtnProps) {
  return (
    <button
      type="button"
      className={cn("btn", `btn-${kind}`, `btn-${size}`, className)}
      onClick={onClick}
      style={
        {
          "--accent": `oklch(0.74 0.15 ${accent})`,
          "--accent-soft": `oklch(0.74 0.15 ${accent} / 0.16)`,
          ...style,
        } as CSSProperties
      }
    >
      {children}
    </button>
  );
}
