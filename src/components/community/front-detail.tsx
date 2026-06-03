import type { CSSProperties } from "react";

import { type Activity } from "@/lib/data";
import { getWorld } from "@/lib/worlds";
import type { Cause } from "@/lib/structure";
import { WorldVideo } from "@/components/world/world-video";
import { WorldGrow } from "@/components/shared/world-grow";
import { ProgressMeter } from "@/components/shared/progress-meter";
import { MilestoneTrail } from "@/components/shared/milestone-trail";
import { ActivityFeed } from "@/components/shared/activity-feed";
import { Avatar } from "@/components/shared/avatar";
import { Btn } from "@/components/shared/btn";

export interface FrontDetailProps {
  cause: Cause;
  raised: number;
  feed: Activity[];
  following: boolean;
  onDonate: () => void;
  onLantern: () => void;
  onFollow: () => void;
}

/** The watch-room detail panel: a video-led card that swaps in place per front. */
export function FrontDetail({
  cause,
  raised,
  feed,
  following,
  onDonate,
  onLantern,
  onFollow,
}: FrontDetailProps) {
  const progress = Math.min(1, raised / cause.goal);
  return (
    <article className="wr-detail" style={{ "--h": cause.accent } as CSSProperties}>
      <div className="wr-detail-vid">
        <WorldVideo key={cause.id} world={getWorld(cause.world)} lazy dim={0.4} />
        <WorldGrow progress={progress} intensity={1} accent={cause.accent} dense />
        <div className="wr-detail-scrim" aria-hidden />
        <div className="wr-detail-cap wr-swap" key={`${cause.id}-cap`}>
          <p className="live-label on-video-label">
            <span className="live-dot" /> {cause.tagline ?? cause.short}
          </p>
          <h3 className="wr-detail-title">{cause.title}</h3>
          <div className="wr-detail-org">
            <Avatar person={cause.organizer} size={26} /> Organized by {cause.organizer.name}
          </div>
        </div>
      </div>
      <div className="wr-detail-pad wr-swap" key={`${cause.id}-pad`}>
        <p className="wr-detail-blurb">{cause.blurb}</p>
        <div className="wr-detail-meter">
          <ProgressMeter
            raised={raised}
            goal={cause.goal}
            accent={cause.accent}
            supporters={cause.supporters}
            daysLeft={cause.daysLeft}
            size="lg"
          />
        </div>
        <div className="wr-actions">
          <Btn kind="primary" size="lg" accent={cause.accent} onClick={onDonate}>
            Plant a light
          </Btn>
          <Btn kind="ghost" size="lg" accent={cause.accent} onClick={onLantern}>
            Send a lantern
          </Btn>
          <Btn kind="ghost" size="lg" accent={cause.accent} onClick={onFollow}>
            {following ? "Keeping watch ✓" : "Keep watch"}
          </Btn>
        </div>
        <div className="wr-cols">
          <div>
            <div className="wr-subh">
              <span
                className="btn-spark"
                style={{ color: `oklch(0.7 0.15 ${cause.accent})` }}
                aria-hidden
              />{" "}
              Milestones
            </div>
            <MilestoneTrail
              milestones={cause.milestones}
              raised={raised}
              accent={cause.accent}
              layout="horizontal"
            />
          </div>
          <div>
            <div className="wr-subh">
              <span className="live-dot" aria-hidden /> Latest updates
            </div>
            {cause.updates.map((u) => (
              <div className="wr-update" key={u.id}>
                <div className="wr-update-meta">
                  {u.author.name} · {u.at}
                </div>
                <h4 className="wr-update-title">{u.title}</h4>
                <p className="wr-update-body">{u.body}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="wr-feed">
          <ActivityFeed items={feed} title="On this front right now" accent={cause.accent} />
        </div>
      </div>
    </article>
  );
}
