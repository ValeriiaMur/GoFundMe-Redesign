import type { Fundraiser } from "@/lib/data";
import { getWorld } from "@/lib/worlds";
import { WorldVideo } from "@/components/world/world-video";
import { WorldGrow } from "@/components/shared/world-grow";
import { ProgressMeter } from "@/components/shared/progress-meter";

export interface CauseCardProps {
  f: Fundraiser;
  raised: number;
  intensity?: number;
  onClick: () => void;
}

/** A cause "world" inside the community grid. */
export function CauseCard({ f, raised, intensity = 1, onClick }: CauseCardProps) {
  return (
    <button className="world-card" onClick={onClick}>
      <div className="world-card-vid">
        <WorldVideo world={getWorld(f.world)} lazy dim={0.28} />
        <WorldGrow progress={Math.min(1, raised / f.goal)} intensity={intensity * 0.7} accent={f.accent} dense={false} />
        <span className="world-card-name">{f.worldName}</span>
      </div>
      <div className="world-card-meta">
        <div className="world-card-title">{f.title}</div>
        <div className="world-card-blurb">{f.blurb}</div>
        <ProgressMeter raised={raised} goal={f.goal} accent={f.accent} supporters={f.supporters} />
      </div>
    </button>
  );
}
