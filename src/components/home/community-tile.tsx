import type { Community } from "@/lib/data";
import { money } from "@/lib/data";
import { getWorld } from "@/lib/worlds";
import { WorldVideo } from "@/components/world/world-video";
import { WorldGrow } from "@/components/shared/world-grow";

export interface CommunityTileProps {
  community: Community;
  onClick: () => void;
}

/** A community "world" in the discover grid — the gathering place above its causes. */
export function CommunityTile({ community: c, onClick }: CommunityTileProps) {
  return (
    <button className="world-card" onClick={onClick}>
      <div className="world-card-vid">
        <WorldVideo world={getWorld(c.world)} lazy dim={0.32} />
        <WorldGrow progress={0.55} intensity={0.7} accent={c.accent} dense={false} />
      </div>
      <div className="world-card-meta">
        <div className="world-card-title">{c.name}</div>
        <div className="world-card-blurb">{c.tagline}</div>
        <div className="tile-stats">
          <span>
            <b>{c.members.toLocaleString()}</b> on watch
          </span>
          <span>
            <b>{money(c.raisedAll)}</b> raised
          </span>
          <span>
            <b>{c.lanterns.toLocaleString()}</b> lanterns
          </span>
        </div>
      </div>
    </button>
  );
}
