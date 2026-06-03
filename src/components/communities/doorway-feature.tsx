import type { CSSProperties } from "react";

import { money, type Community } from "@/lib/data";
import { getWorld } from "@/lib/worlds";
import { WorldVideo } from "@/components/world/world-video";
import { WorldGrow } from "@/components/shared/world-grow";
import { Avatar } from "@/components/shared/avatar";

export interface DoorwayFeatureProps {
  community: Community;
  raised: number;
  progress: number;
  onEnter: () => void;
}

/** The doorway's featured panel: a tall immersive card for the previewed community. */
export function DoorwayFeature({ community, raised, progress, onEnter }: DoorwayFeatureProps) {
  return (
    <article
      className="idx-feature"
      style={{ "--h": community.accent } as CSSProperties}
      key={community.id}
    >
      <WorldVideo key={community.world} world={getWorld(community.world)} lazy dim={0.4} />
      <WorldGrow progress={progress} intensity={1} accent={community.accent} dense />
      <div className="idx-feature-scrim" aria-hidden />
      <div className="idx-feature-cap wr-swap" key={`${community.id}-cap`}>
        {community.pulse && (
          <p className="live-label on-video-label">
            <span className="live-dot" /> {community.pulse}
          </p>
        )}
        <h3 className="idx-feature-name">{community.name}</h3>
        <p className="idx-feature-tag">{community.tagline}</p>
        <div className="idx-feature-stats">
          <div>
            <b>{community.members.toLocaleString()}</b>
            <span>members</span>
          </div>
          <div>
            <b>{money(raised)}</b>
            <span>raised</span>
          </div>
          <div>
            <b>{community.lanterns.toLocaleString()}</b>
            <span>lanterns</span>
          </div>
        </div>
        <div className="idx-feature-row">
          <button type="button" className="btn btn-lg idx-enter" onClick={onEnter}>
            Enter {community.name} →
          </button>
          <div className="idx-stewards">
            <div className="idx-stewards-row">
              {community.stewards.map((p) => (
                <span key={p.id}>
                  <Avatar person={p} size={30} />
                </span>
              ))}
            </div>
            <span className="idx-stewards-cap">stewarding</span>
          </div>
        </div>
      </div>
    </article>
  );
}
