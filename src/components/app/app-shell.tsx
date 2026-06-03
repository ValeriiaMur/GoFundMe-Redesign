"use client";

import { type ReactNode, useRef, useState } from "react";

import { BRAND } from "@/lib/data";
import { getWorld } from "@/lib/worlds";
import { Header } from "@/components/app/header";
import { IntroDock } from "@/components/world/intro-dock";

/** Persistent chrome that survives client navigation: header + docking intro. */
export function AppShell({ children }: { children: ReactNode }) {
  const slotRef = useRef<HTMLDivElement>(null);
  const [replay, setReplay] = useState(0);

  return (
    <div className="app">
      <Header slotRef={slotRef} />
      <IntroDock
        key={replay}
        world={getWorld(BRAND.world)}
        kicker={BRAND.arrival.kicker}
        headline={BRAND.arrival.headline}
        sub={BRAND.arrival.sub}
        introStyle="cinematic"
        slotRef={slotRef}
      />
      <button
        className="navlink"
        style={{ position: "fixed", right: 14, bottom: 14, zIndex: 110 }}
        onClick={() => setReplay((n) => n + 1)}
      >
        Replay intro
      </button>
      <div className="scroller">{children}</div>
    </div>
  );
}
