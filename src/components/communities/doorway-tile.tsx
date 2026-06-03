import type { CSSProperties } from "react";

import { money, type Community } from "@/lib/data";
import { getWorld } from "@/lib/worlds";
import { cn } from "@/lib/utils";
import { WorldVideo } from "@/components/world/world-video";
import { WorldGrow } from "@/components/shared/world-grow";

export interface DoorwayTileProps {
  community: Community;
  raised: number;
  active: boolean;
  /** Hover/focus (and first activation) previews the community in the feature panel. */
  onPreview: () => void;
  /** Activating an already-previewed tile enters the community. */
  onEnter: () => void;
}

/** A selectable community tile in the doorway list: glimmering thumb + live pulse. */
export function DoorwayTile({ community, raised, active, onPreview, onEnter }: DoorwayTileProps) {
  return (
    <button
      type="button"
      className={cn("idx-card", active && "on")}
      style={{ "--h": community.accent } as CSSProperties}
      onMouseEnter={onPreview}
      onFocus={onPreview}
      onClick={() => (active ? onEnter() : onPreview())}
      aria-pressed={active}
    >
      <div className="idx-card-thumb">
        {/* Poster only for performance — sparks still ride on top. */}
        <WorldVideo world={getWorld(community.world)} still dim={0.28} />
        <WorldGrow progress={0.5} intensity={0.45} accent={community.accent} />
      </div>
      <div className="idx-card-body">
        {community.pulse && (
          <div className="idx-pulse-mini">
            <span className="live-dot" /> {community.pulse}
          </div>
        )}
        <div className="idx-card-name">{community.name}</div>
        <div className="idx-card-tag">{community.tagline}</div>
        <div className="idx-card-meta">
          <span>
            <b>{community.members.toLocaleString()}</b> members
          </span>
          <span>
            <b>{community.fundraisers.length}</b> causes
          </span>
          <span>
            <b>{money(raised)}</b>
          </span>
        </div>
      </div>
    </button>
  );
}
