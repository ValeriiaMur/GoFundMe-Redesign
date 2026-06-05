"use client";

import type { CSSProperties } from "react";

import type { Community } from "@/lib/data";
import { getWorld } from "@/lib/worlds";
import { WorldVideo } from "@/components/world/world-video";
import { WorldGrow } from "@/components/shared/world-grow";
import { Avatar } from "@/components/shared/avatar";

export interface WatchTileProps {
  community: Community;
  /** Live raised total across the community's fundraisers. */
  raised: number;
  onEnter: () => void;
}

/** The dominant 2×2 community tile of the atlas bento. */
export function WatchTile({ community, raised, onEnter }: WatchTileProps) {
  return (
    <button
      className="tile tile-media tile-watch tile-area-watch"
      style={{ "--h": community.accent } as CSSProperties}
      onClick={onEnter}
    >
      <WorldVideo world={getWorld(community.world)} still dim={0.34} />
      <WorldGrow progress={0.66} intensity={1} accent={community.accent} dense />
      <div className="tile-scrim" aria-hidden />
      <span className="tile-toplabel">
        <span className="live-dot" /> 31 keeping watch right now
      </span>
      <div className="tile-content">
        <h2 className="tile-watch-name">{community.name}</h2>
        <p className="tile-watch-tag">{community.tagline}</p>
        <div className="tile-watch-foot">
          <span className="btn btn-md tile-enter">
            Enter the watch <span className="btn-arrow">→</span>
          </span>
          <div className="tile-watch-stats">
            <div className="tile-watch-stat">
              <b>{community.members.toLocaleString("en-US")}</b>
              <span>members</span>
            </div>
            <div className="tile-watch-stat">
              <b>${Math.round(raised / 1000)}K</b>
              <span>raised</span>
            </div>
          </div>
          <div className="tile-faces">
            {community.stewards.slice(0, 4).map((p) => (
              <span key={p.id}>
                <Avatar person={p} size={28} />
              </span>
            ))}
          </div>
        </div>
      </div>
    </button>
  );
}
