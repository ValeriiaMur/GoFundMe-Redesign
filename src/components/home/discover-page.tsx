"use client";

import type { CSSProperties } from "react";

import type { Community } from "@/lib/data";
import { getWorld } from "@/lib/worlds";
import { causesOf, listCauses, listCommunities } from "@/lib/structure";
import { useSite } from "@/components/app/site-provider";
import { WorldVideo } from "@/components/world/world-video";
import { WorldGrow } from "@/components/shared/world-grow";
import { Btn } from "@/components/shared/btn";
import { DoorwayFeature } from "@/components/communities/doorway-feature";
import { FrontRow } from "@/components/community/front-row";

/** The home / discover index: a cinematic arrival, then the doorway into communities and fronts. */
export function DiscoverPage() {
  const site = useSite();
  const communities = listCommunities();
  const causes = listCauses();
  const featured = communities[0];

  const raisedOf = (c: Community) =>
    causesOf(c).reduce((sum, f) => sum + site.raisedFor(f.id), 0);
  const progressOf = (c: Community) => {
    const cs = causesOf(c);
    const goal = cs.reduce((sum, f) => sum + f.goal, 0);
    return goal > 0 ? Math.min(1, raisedOf(c) / goal) : 0.5;
  };

  return (
    <div className="page page-discover">
      <section className="chero dhero">
        <div className="hero-world tall">
          <WorldVideo world={getWorld(featured.world)} priority dim={0.5} />
          <WorldGrow progress={0.62} intensity={1.1} accent={featured.accent} />
        </div>
        <div className="chero-scrim" aria-hidden />
        <div className="chero-overlay">
          <p className="live-label on-video-label chero-pulse">
            <span className="live-dot" /> Help finds a way
          </p>
          <h1 className="chero-name">Every cause is a place. Find yours.</h1>
          <p className="chero-tag">
            Communities of neighbors keeping watch over the causes they love — step inside one and
            plant a light.
          </p>
          <div className="chero-cta">
            <Btn kind="primary" accent={featured.accent} size="lg" onClick={site.goCommunities}>
              Explore communities
            </Btn>
            <Btn kind="ghost" accent={featured.accent} onClick={() => site.goCause("alerts")}>
              See a fundraiser
            </Btn>
          </div>
        </div>
      </section>

      <div className="home-body">
        <section>
          <div className="home-head">
            <p className="kicker" style={{ "--accent": "oklch(0.6 0.14 48)" } as CSSProperties}>
              Communities
            </p>
            <h2 className="block-h">Step inside a gathering</h2>
            <p className="block-sub">
              Neighbors gathered around the fundraisers they share.{" "}
              <button className="inline-link" onClick={site.goCommunities}>
                See all communities
              </button>
            </p>
          </div>
          <div className="home-features">
            {communities.map((c) => (
              <DoorwayFeature
                key={c.id}
                community={c}
                raised={raisedOf(c)}
                progress={progressOf(c)}
                onEnter={() => site.goCommunity(c.handle)}
              />
            ))}
          </div>
        </section>

        <section>
          <div className="home-head">
            <p className="kicker" style={{ "--accent": "oklch(0.6 0.14 48)" } as CSSProperties}>
              Fundraisers
            </p>
            <h2 className="block-h">Where help is needed now</h2>
            <p className="block-sub">
              Every fundraiser lives inside a community. Step into one to help.
            </p>
          </div>
          <div className="home-rows">
            {causes.map((f) => (
              <FrontRow
                key={f.id}
                cause={f}
                raised={site.raisedFor(f.id)}
                active={false}
                onSelect={() => site.goCause(f.id)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
