import type { CSSProperties } from "react";

import { money, type Milestone } from "@/lib/data";
import { cn } from "@/lib/utils";

export interface MilestoneTrailProps {
  milestones: Milestone[];
  raised: number;
  accent?: number;
  /** "vertical" timeline (default) or the watch-room "horizontal" trail. */
  layout?: "vertical" | "horizontal";
}

/** Timeline of funding milestones; reached ones light up from live `raised`. */
export function MilestoneTrail({
  milestones,
  raised,
  accent = 52,
  layout = "vertical",
}: MilestoneTrailProps) {
  if (layout === "horizontal") {
    return (
      <div className="mtrail-h" style={{ "--h": accent } as CSSProperties}>
        {milestones.map((m, i) => (
          <div key={i} className={cn("ms", raised >= m.at && "done")}>
            <span className="ms-dot" />
            <div className="ms-label">{m.label}</div>
            <div className="ms-at">{money(m.at)}</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mtrail">
      {milestones.map((m, i) => {
        const reached = raised >= m.at;
        return (
          <div key={i} className={cn("mstone", reached && "done")}>
            <div
              className="mstone-dot"
              style={
                reached
                  ? {
                      background: `oklch(0.78 0.16 ${accent})`,
                      boxShadow: `0 0 14px oklch(0.78 0.16 ${accent} / 0.8)`,
                    }
                  : undefined
              }
            />
            <div className="mstone-body">
              <div className="mstone-label">{m.label}</div>
              <div className="mstone-at">{money(m.at)}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
