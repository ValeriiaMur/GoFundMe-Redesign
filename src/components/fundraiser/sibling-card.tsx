import type { Fundraiser } from "@/lib/data";
import { getWorld } from "@/lib/worlds";
import { WorldVideo } from "@/components/world/world-video";
import { ProgressMeter } from "@/components/shared/progress-meter";

export interface SiblingCardProps {
  f: Fundraiser;
  raised: number;
  onClick: () => void;
}

/** A sibling fundraiser in the same watch. */
export function SiblingCard({ f, raised, onClick }: SiblingCardProps) {
  return (
    <button className="sibling-card" onClick={onClick}>
      <div className="sibling-world">
        <WorldVideo world={getWorld(f.world)} lazy dim={0.3} />
      </div>
      <div className="sibling-meta">
        <div className="sibling-title">{f.title}</div>
        <ProgressMeter raised={raised} goal={f.goal} accent={f.accent} showBar />
      </div>
    </button>
  );
}
