"use client";

import { getWorld } from "@/lib/worlds";
import { listCommunities } from "@/lib/structure";
import { useSite } from "@/components/app/site-provider";
import { WorldVideo } from "@/components/world/world-video";
import { WorldGrow } from "@/components/shared/world-grow";
import { Reveal } from "@/components/shared/reveal";
import { CommunityTile } from "@/components/home/community-tile";

/** The "list of all" communities — the menu destination. Click a tile → community detail. */
export function CommunitiesIndex() {
  const site = useSite();
  const communities = listCommunities();
  const featured = communities[0];

  return (
    <div className="page page-index">
      <section className="chero dhero short">
        <div className="hero-world tall">
          <WorldVideo world={getWorld(featured.world)} priority dim={0.52} />
          <WorldGrow progress={0.5} intensity={0.9} accent={featured.accent} />
        </div>
        <div className="chero-overlay">
          <div className="chero-pulse">
            <span className="live-dot" /> Communities
          </div>
          <h1 className="chero-name">Find a community to stand with.</h1>
          <p className="chero-tag">
            Every community gathers around the fundraisers its members care about. Step inside one to
            see its causes.
          </p>
        </div>
      </section>

      <section className="block">
        <Reveal>
          <h2 className="block-h">All communities</h2>
          <p className="block-sub">{communities.length} gathering right now.</p>
        </Reveal>
        <div className="world-grid">
          {communities.map((c, i) => (
            <Reveal key={c.id} delay={i * 90}>
              <CommunityTile community={c} onClick={() => site.goCommunity(c.handle)} />
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
