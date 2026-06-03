import type { CSSProperties } from "react";

import { fundedPct } from "@/lib/progress";
import { getWorld } from "@/lib/worlds";
import { cn } from "@/lib/utils";
import type { Cause } from "@/lib/structure";
import { WorldVideo } from "@/components/world/world-video";
import { WorldGrow } from "@/components/shared/world-grow";

export interface FrontRowProps {
  cause: Cause;
  raised: number;
  active: boolean;
  onSelect: () => void;
  /**
   * When true, the row acts as a selectable toggle (the watch-room rail picks
   * which front the detail panel shows) and exposes `aria-pressed`. When false
   * or omitted, it's a plain navigation button (the home rows) and stays free of
   * toggle semantics that would mislead assistive tech.
   */
  selectable?: boolean;
}

/** A fundraiser ("front") row in the watch-room rail: glimmering thumb + thin meter. */
export function FrontRow({ cause, raised, active, onSelect, selectable }: FrontRowProps) {
  const pct = fundedPct(raised, cause.goal);
  return (
    <button
      type="button"
      className={cn("wr-row", active && "on")}
      style={{ "--h": cause.accent } as CSSProperties}
      onClick={onSelect}
      aria-pressed={selectable ? active : undefined}
    >
      <div className="wr-row-thumb">
        {/* Poster only for performance — but the sparks still ride on top. */}
        <WorldVideo world={getWorld(cause.world)} still dim={0.22} />
        <WorldGrow progress={pct / 100} intensity={0.5} accent={cause.accent} />
      </div>
      <div className="wr-row-body">
        <div className="wr-row-title">{cause.short}</div>
        <div className="wr-row-track">
          <div className="wr-row-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="wr-row-meta">
          {Math.round(pct)}% · {cause.supporters.toLocaleString()} supporters · {cause.daysLeft}d left
        </div>
      </div>
    </button>
  );
}
