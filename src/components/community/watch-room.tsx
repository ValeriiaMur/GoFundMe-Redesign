"use client";

import { useState, type CSSProperties } from "react";

import type { Activity, Community } from "@/lib/data";
import type { Cause } from "@/lib/structure";
import { track } from "@/lib/analytics";
import { FrontRow } from "@/components/community/front-row";
import { FrontDetail } from "@/components/community/front-detail";

export interface WatchRoomProps {
  community: Community;
  causes: Cause[];
  raisedFor: (id: string) => number;
  feed: Activity[];
  followedById: Record<string, boolean>;
  onDonate: (id: string) => void;
  onLantern: (id: string) => void;
  onFollow: (id: string) => void;
}

/** Master-detail body: a rail of fronts, and a detail panel that updates in place. */
export function WatchRoom({
  community,
  causes,
  raisedFor,
  feed,
  followedById,
  onDonate,
  onLantern,
  onFollow,
}: WatchRoomProps) {
  const [selectedCauseId, setSelectedCauseId] = useState(causes[0]?.id);
  const selected = causes.find((c) => c.id === selectedCauseId) ?? causes[0];
  if (!selected) return null;

  const filteredFeed = feed
    .filter((a) => a.target === selected.id || a.target === community.id)
    .slice(0, 4);

  return (
    <section className="wr-body">
      <div className="wr-head">
        <p className="kicker" style={{ "--accent": "var(--ember)" } as CSSProperties}>
          This community · {causes.length} causes
        </p>
        <h2 className="block-h">The causes this community carries</h2>
        <p className="block-sub">
          Pick a cause to see how it&rsquo;s doing. The room updates around you — no page to
          leave.
        </p>
      </div>
      <div className="wr-grid">
        <div className="wr-rail">
          <div className="wr-rail-h">Fundraisers</div>
          {causes.map((cause) => (
            <FrontRow
              key={cause.id}
              cause={cause}
              raised={raisedFor(cause.id)}
              active={cause.id === selected.id}
              selectable
              onSelect={() => {
                if (cause.id !== selected.id) {
                  track({
                    name: "select_front",
                    props: { causeId: cause.id, communityId: community.id },
                  });
                }
                setSelectedCauseId(cause.id);
              }}
            />
          ))}
        </div>
        <FrontDetail
          cause={selected}
          raised={raisedFor(selected.id)}
          feed={filteredFeed}
          following={Boolean(followedById[selected.id])}
          onDonate={() => onDonate(selected.id)}
          onLantern={() => onLantern(selected.id)}
          onFollow={() => onFollow(selected.id)}
        />
      </div>
    </section>
  );
}
