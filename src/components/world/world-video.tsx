"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/use-in-view";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import type { WorldSource } from "@/lib/worlds";

export interface WorldVideoProps {
  /** The world clip to play (webm + mp4 + poster). */
  world: WorldSource;
  /** Wrapper classes. Defaults to an absolutely-positioned cover layer. */
  className?: string;
  /** Dark scrim opacity over the video, 0–1. */
  dim?: number;
  /** Only load once scrolled near the viewport. */
  lazy?: boolean;
  /** Load eagerly (e.g. above-the-fold hero). Overrides `lazy`. */
  priority?: boolean;
  /** Pre-load margin for lazy loading. */
  rootMargin?: string;
  /** Poster-only: never mounts the video (e.g. tiny rail thumbnails). */
  still?: boolean;
}

/**
 * Reusable ambient background clip — webm-then-mp4 with a poster, muted/looping
 * and lazily loaded. Honors `prefers-reduced-motion` by showing the poster only.
 */
export function WorldVideo({
  world,
  className,
  dim = 0,
  lazy = false,
  priority = false,
  rootMargin,
  still = false,
}: WorldVideoProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [inViewRef, inView] = useInView<HTMLDivElement>({ rootMargin });
  const videoRef = useRef<HTMLVideoElement>(null);

  const active = !still && !reducedMotion && (priority || !lazy || inView);

  useEffect(() => {
    if (active) videoRef.current?.play?.().catch(() => {});
  }, [active]);

  return (
    <div
      ref={lazy && !priority ? inViewRef : undefined}
      className={cn("absolute inset-0 overflow-hidden bg-black", className)}
    >
      {/* Poster paints immediately; it also covers the reduced-motion case. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={world.poster}
        alt={world.name}
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
      />
      {active && (
        <video
          ref={videoRef}
          poster={world.poster}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={world.webm} type="video/webm" />
          <source src={world.mp4} type="video/mp4" />
        </video>
      )}
      {dim > 0 && (
        <div
          className="absolute inset-0"
          style={{ background: "var(--world-scrim, #000)", opacity: dim }}
          aria-hidden
        />
      )}
    </div>
  );
}
