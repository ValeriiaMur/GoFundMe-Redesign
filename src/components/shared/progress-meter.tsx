import { money } from "@/lib/data";
import { fundedPct } from "@/lib/progress";

export interface ProgressMeterProps {
  raised: number;
  goal: number;
  accent?: number;
  supporters?: number;
  showBar?: boolean;
}

/** Donation meter: amount raised, a fill bar, and percent funded. */
export function ProgressMeter({
  raised,
  goal,
  accent = 52,
  supporters,
  showBar = true,
}: ProgressMeterProps) {
  const pct = fundedPct(raised, goal);
  return (
    <div className="meter">
      <div className="meter-top">
        <span className="meter-raised">{money(raised)}</span>
        <span className="meter-goal">raised of {money(goal)}</span>
      </div>
      {showBar && (
        <div className="meter-track">
          <div
            className="meter-fill"
            style={{
              width: `${pct}%`,
              background: `linear-gradient(90deg, oklch(0.7 0.15 ${accent}), oklch(0.84 0.13 ${accent + 30}))`,
            }}
          />
        </div>
      )}
      <div className="meter-sub">
        <b>{pct.toFixed(0)}% funded</b>
        {supporters != null && <> · {supporters.toLocaleString()} keeping watch</>}
      </div>
    </div>
  );
}
