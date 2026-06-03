"use client";

import { money } from "@/lib/data";
import { causesOf, getCommunity } from "@/lib/structure";
import { getWorld } from "@/lib/worlds";
import { useSite } from "@/components/app/site-provider";
import { WorldVideo } from "@/components/world/world-video";
import { WorldGrow } from "@/components/shared/world-grow";
import { Btn } from "@/components/shared/btn";
import { WatchRoom } from "@/components/community/watch-room";

export function CommunityPage({ id = "watch" }: { id?: string }) {
  const site = useSite();
  const c = getCommunity(id);
  if (!c) return null;

  const fundraisers = causesOf(c);
  const totalRaised = fundraisers.reduce((s, f) => s + site.raisedFor(f.id), 0);
  const totalGoal = fundraisers.reduce((s, f) => s + f.goal, 0);
  const progress = Math.min(1, totalRaised / totalGoal);

  return (
    <div className="page page-community">
      <section className="chero">
        <div className="hero-world tall">
          <WorldVideo world={getWorld(c.world)} priority dim={0.42} />
          <WorldGrow progress={progress} intensity={1} accent={c.accent} />
        </div>
        <div className="chero-scrim" aria-hidden />
        <div className="chero-overlay">
          {c.pulse && (
            <p className="live-label on-video-label chero-pulse">
              <span className="live-dot" /> {c.pulse}
            </p>
          )}
          <h1 className="chero-name">{c.name}</h1>
          <p className="chero-tag">{c.tagline}</p>
          <div className="chero-stats">
            <div>
              <b>{c.members.toLocaleString()}</b>
              <span>on watch</span>
            </div>
            <div>
              <b>{money(totalRaised)}</b>
              <span>raised together</span>
            </div>
            <div>
              <b>{c.lanterns.toLocaleString()}</b>
              <span>lanterns</span>
            </div>
          </div>
          <div className="chero-cta">
            <Btn kind="primary" accent={c.accent} size="lg" onClick={site.join}>
              {site.joined ? "On the watch ✓" : "Join the watch"}
            </Btn>
            <Btn
              kind="ghost"
              size="lg"
              accent={c.accent}
              onClick={() => site.openLantern({ kind: "community", id: c.id })}
            >
              Send a lantern
            </Btn>
          </div>
        </div>
      </section>

      <WatchRoom
        community={c}
        causes={fundraisers}
        raisedFor={site.raisedFor}
        feed={site.feed}
        followedById={site.followedById}
        onDonate={site.openDonate}
        onLantern={(causeId) => site.openLantern({ kind: "fundraiser", id: causeId })}
        onFollow={site.follow}
      />
    </div>
  );
}
