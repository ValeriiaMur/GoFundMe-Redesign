import type { Community } from "@/lib/data";
import { money } from "@/lib/data";
import { getWorld } from "@/lib/worlds";
import { WorldVideo } from "@/components/world/world-video";

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
        </div>
      </div>
    </button>
  );
}
