"use client";

import { type RefObject } from "react";
import { usePathname } from "next/navigation";

import { BRAND, COMMUNITIES, PROFILES } from "@/lib/data";
import { Avatar } from "@/components/shared/avatar";
import { useSite } from "@/components/app/site-provider";
import { cn } from "@/lib/utils";

export interface HeaderProps {
  slotRef: RefObject<HTMLDivElement | null>;
}

/** Fixed top chrome: the docking emblem slot, wordmark, nav, and profile. */
export function Header({ slotRef }: HeaderProps) {
  const pathname = usePathname();
  const { goHome, goCommunity, goCause, goProfile } = useSite();
  const onCommunity = pathname.startsWith("/communities");
  const onCause = pathname.startsWith("/f");

  return (
    <header className="hdr">
      <div className="hdr-left">
        <div className="emblem-slot" ref={slotRef} title="The world you're in" />
        <button className="wordmark" onClick={goHome}>
          <span className="wordmark-name">{BRAND.name}</span>
          <span className="wordmark-world">{BRAND.tagline}</span>
        </button>
      </div>
      <nav className="hdr-nav">
        <button
          className={cn("navlink", onCommunity && "on")}
          onClick={() => goCommunity(COMMUNITIES.watch.handle)}
        >
          The Watch
        </button>
        <button className={cn("navlink", onCause && "on")} onClick={() => goCause("alerts")}>
          Causes
        </button>
      </nav>
      <div className="hdr-right">
        <button className="iconbtn" title="Notifications">
          <span className="bell" />
          <span className="badge" />
        </button>
        <button className="hdr-me" onClick={() => goProfile(PROFILES.janahan.handle)}>
          <Avatar person={PROFILES.janahan} size={32} ring />
        </button>
      </div>
    </header>
  );
}
