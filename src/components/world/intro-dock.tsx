"use client";

import { type CSSProperties, type RefObject, useCallback, useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { WorldVideo } from "@/components/world/world-video";
import type { WorldSource } from "@/lib/worlds";

type Phase = "full" | "docked";
type IntroStyle = "cinematic" | "scroll" | "instant";

export interface IntroDockProps {
  world: WorldSource;
  kicker?: string;
  headline: string;
  sub?: string;
  introStyle?: IntroStyle;
  /** The empty header slot the video docks into. */
  slotRef: RefObject<HTMLElement | null>;
}

interface Geo {
  top: number;
  left: number;
  width: number;
  height: number;
}

const DOCK_DELAY = 2700;

/**
 * The signature move: the world video fills the screen on arrival, then animates
 * into the header emblem slot and keeps quietly breathing as the logo.
 */
export function IntroDock({
  world,
  kicker,
  headline,
  sub,
  introStyle = "cinematic",
  slotRef,
}: IntroDockProps) {
  const [phase, setPhase] = useState<Phase>(introStyle === "instant" ? "docked" : "full");
  const [geo, setGeo] = useState<Geo | null>(null);

  const measure = useCallback(() => {
    const el = slotRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setGeo({ top: r.top, left: r.left, width: r.width, height: r.height });
  }, [slotRef]);

  // Keep the dock target measured.
  useEffect(() => {
    measure();
    const el = slotRef.current;
    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined" && el) {
      ro = new ResizeObserver(measure);
      ro.observe(el);
    }
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, { passive: true });
    const t = setTimeout(measure, 60);
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure);
      clearTimeout(t);
    };
  }, [measure, slotRef]);

  // Intro choreography. Initial phase is set by useState; the effect only
  // schedules the (asynchronous) transition to docked. Replaying the arrival is
  // done by the parent via a changing `key`, which remounts cleanly.
  useEffect(() => {
    if (introStyle === "instant") return;
    if (introStyle === "cinematic") {
      const t = setTimeout(() => setPhase("docked"), DOCK_DELAY);
      return () => clearTimeout(t);
    }
    // scroll
    const onScroll = () => {
      if (window.scrollY > 36) {
        setPhase("docked");
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const fallback = setTimeout(() => setPhase("docked"), 6500);
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(fallback);
    };
  }, [introStyle]);

  const isFull = phase === "full";

  const frameStyle: CSSProperties =
    isFull || !geo
      ? { top: 0, left: 0, width: "100vw", height: "100vh", borderRadius: 0 }
      : {
          top: geo.top,
          left: geo.left,
          width: geo.width,
          height: geo.height,
          borderRadius: 15,
        };

  return (
    <div
      data-phase={phase}
      role="button"
      tabIndex={0}
      aria-label={isFull ? `Enter ${world.name}` : "Replay the arrival"}
      onClick={() => setPhase(isFull ? "docked" : "full")}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") setPhase(isFull ? "docked" : "full");
      }}
      style={frameStyle}
      className={cn(
        "fixed z-[200] overflow-hidden bg-black",
        "transition-[top,left,width,height,border-radius] duration-[920ms] ease-[cubic-bezier(0.66,0,0.2,1)]",
        isFull ? "cursor-pointer" : "cursor-pointer shadow-lg ring-1 ring-amber-200/25",
      )}
    >
      <WorldVideo world={world} priority dim={isFull ? 0.34 : 0.12} />

      <div
        className={cn(
          "pointer-events-none absolute inset-0 flex flex-col items-center justify-center p-6 text-center transition-opacity duration-500",
          isFull ? "opacity-100" : "opacity-0",
        )}
      >
        {kicker && (
          <div className="mb-3.5 font-mono text-xs uppercase tracking-[0.32em] text-amber-200/80">
            {kicker}
          </div>
        )}
        <div className="max-w-[14ch] text-balance text-[clamp(34px,6vw,76px)] font-medium leading-[1.05] text-white drop-shadow-lg">
          {headline}
        </div>
        {sub && (
          <div className="mt-3.5 font-mono text-[clamp(15px,1.6vw,19px)] tracking-wide text-amber-50/85">
            {sub}
          </div>
        )}
        <div className="absolute bottom-9 animate-pulse font-mono text-[11px] uppercase tracking-[0.22em] text-amber-100/60">
          {introStyle === "scroll" ? "scroll to enter ↓" : "settling in…"}
        </div>
      </div>
    </div>
  );
}
