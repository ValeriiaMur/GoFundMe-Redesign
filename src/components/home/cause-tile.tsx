"use client";

import type { CSSProperties } from "react";

import type { Fundraiser } from "@/lib/data";
import { getWorld } from "@/lib/worlds";
import { WorldVideo } from "@/components/world/world-video";
import { WorldGrow } from "@/components/shared/world-grow";

export interface CauseTileProps {
  cause: Fundraiser;
  /** Live raised amount for the cause. */
  raised: number;
  /** Bento grid area: alerts | shelter | replant. */
  area: string;
  onOpen: () => void;
}

/** A fundraiser tile in the atlas bento: poster, progress and meta. */
export function CauseTile({ cause, raised, area, onOpen }: CauseTileProps) {
  const pct = Math.min(100, Math.round((raised / cause.goal) * 100));
  return (
    <button
      className={`tile tile-media tile-cause tile-area-${area}`}
      style={{ "--h": cause.accent } as CSSProperties}
      onClick={onOpen}
    >
      <WorldVideo world={getWorld(cause.world)} still dim={0.18} />
      <WorldGrow progress={pct / 100} intensity={0.6} accent={cause.accent} dense={false} />
      <div className="tile-scrim" aria-hidden />
      <span className="tile-toplabel">Fundraiser</span>
      <div className="tile-content">
        <h3 className="tile-cause-title">{cause.short}</h3>
        <div className="tile-cause-track">
          <div className="tile-cause-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="tile-cause-meta">
          <span>
            <b>{pct}%</b> funded
          </span>
          <span>
            <b>{cause.daysLeft}</b> days left
          </span>
        </div>
      </div>
    </button>
  );
}
