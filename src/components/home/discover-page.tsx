"use client";

import { getWorld } from "@/lib/worlds";
import { listCauses, listCommunities } from "@/lib/structure";
import { useSite } from "@/components/app/site-provider";
import { WorldVideo } from "@/components/world/world-video";
import { WorldGrow } from "@/components/shared/world-grow";
import { Btn } from "@/components/shared/btn";
import { Reveal } from "@/components/shared/reveal";
import { CauseCard } from "@/components/community/cause-card";
import { CommunityTile } from "@/components/home/community-tile";

/** The home / discover index: a cinematic arrival, then communities and their fundraisers. */
export function DiscoverPage() {
  const site = useSite();
  const communities = listCommunities();
  const causes = listCauses();
  const featured = communities[0];

  return (
    <div className="page page-discover">
      <section className="chero dhero">
        <div className="hero-world tall">
          <WorldVideo world={getWorld(featured.world)} priority dim={0.5} />
          <WorldGrow progress={0.62} intensity={1.1} accent={featured.accent} />
        </div>
        <div className="chero-overlay">
          <div className="chero-pulse">
            <span className="live-dot" /> Help finds a way
          </div>
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

      <section className="block">
        <Reveal>
          <h2 className="block-h">Communities</h2>
          <p className="block-sub">
            Neighbors gathered around the fundraisers they share.{" "}
            <button className="inline-link" onClick={site.goCommunities}>
              See all communities
            </button>
          </p>
        </Reveal>
        <div className="world-grid">
          {communities.map((c, i) => (
            <Reveal key={c.id} delay={i * 90}>
              <CommunityTile community={c} onClick={() => site.goCommunity(c.handle)} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="block">
        <Reveal>
          <h2 className="block-h">Fundraisers</h2>
          <p className="block-sub">Every fundraiser lives inside a community. Step into one to help.</p>
        </Reveal>
        <div className="world-grid">
          {causes.map((f, i) => (
            <Reveal key={f.id} delay={i * 90}>
              <CauseCard f={f} raised={site.raisedFor(f.id)} onClick={() => site.goCause(f.id)} />
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
