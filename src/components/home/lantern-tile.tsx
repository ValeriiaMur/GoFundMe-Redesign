"use client";

import { useState, type CSSProperties } from "react";

import type { Community } from "@/lib/data";
import { WorldGrow } from "@/components/shared/world-grow";

export interface LanternTileProps {
  community: Community;
  /** Live lantern count for the community. */
  lanterns: number;
}

interface Flying {
  id: number;
  dx: number;
}

/** Interactive clay tile: tap to light a lantern and watch it fly. */
export function LanternTile({ community, lanterns }: LanternTileProps) {
  const [extra, setExtra] = useState(0);
  const [flying, setFlying] = useState<Flying[]>([]);

  const light = () => {
    setExtra((n) => n + 1);
    const id = Date.now() + Math.random();
    const dx = Math.round((Math.random() - 0.5) * 80);
    setFlying((f) => [...f, { id, dx }]);
    setTimeout(() => setFlying((f) => f.filter((x) => x.id !== id)), 2200);
  };

  return (
    <button className="tile tile-area-lanterns tile-lantern" onClick={light} aria-label="Light a lantern">
      <div className="tile-lan-field">
        <WorldGrow progress={0.7} intensity={0.7} accent={86} dense />
      </div>
      {flying.map((f) => (
        <span key={f.id} className="fly-lantern" style={{ "--dx": `${f.dx}px` } as CSSProperties} />
      ))}
      <div className="tile-content">
        <span className="tile-lan-count">{(lanterns + extra).toLocaleString("en-US")}</span>
        <span className="tile-lan-label">lanterns lit for {community.name.toLowerCase().includes("watch") ? "the watch" : community.name}</span>
        <span className="tile-lan-cta">
          Light one <span className="up">↑</span>
        </span>
      </div>
    </button>
  );
}
