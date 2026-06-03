"use client";

import { type ReactNode, useRef } from "react";

import { BRAND } from "@/lib/data";
import { getWorld } from "@/lib/worlds";
import { Header } from "@/components/app/header";
import { IntroDock } from "@/components/world/intro-dock";

/** Persistent chrome that survives client navigation: header + docking intro.
 *  (Clicking the docked emblem re-expands the intro — no separate replay button.) */
export function AppShell({ children }: { children: ReactNode }) {
  const slotRef = useRef<HTMLDivElement>(null);

  return (
    <div className="app">
      <Header slotRef={slotRef} />
      <IntroDock
        world={getWorld(BRAND.world)}
        kicker={BRAND.arrival.kicker}
        headline={BRAND.arrival.headline}
        sub={BRAND.arrival.sub}
        introStyle="cinematic"
        slotRef={slotRef}
      />
      <div className="scroller">{children}</div>
    </div>
  );
}
