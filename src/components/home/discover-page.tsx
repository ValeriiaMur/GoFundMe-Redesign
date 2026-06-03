"use client";

import { BRAND } from "@/lib/data";
import { listCauses, listCommunities } from "@/lib/structure";
import { useSite } from "@/components/app/site-provider";
import { CauseCard } from "@/components/community/cause-card";
import { CommunityTile } from "@/components/home/community-tile";

/** The home / discover index: communities at the top of the hierarchy, then their causes. */
export function DiscoverPage() {
  const site = useSite();
  const communities = listCommunities();
  const causes = listCauses();

  return (
    <div className="page page-discover">
      <section className="block discover-hero">
        <p className="kicker">{BRAND.arrival.kicker}</p>
        <h1 className="discover-h">{BRAND.arrival.headline}</h1>
        <p className="discover-sub">{BRAND.arrival.sub}</p>
      </section>

      <section className="block">
        <h2 className="block-h">Communities</h2>
        <p className="block-sub">
          Neighbors gathered around the fundraisers they share.{" "}
          <button className="inline-link" onClick={site.goCommunities}>
            See all communities
          </button>
        </p>
        <div className="world-grid">
          {communities.map((c) => (
            <CommunityTile key={c.id} community={c} onClick={() => site.goCommunity(c.handle)} />
          ))}
        </div>
      </section>

      <section className="block">
        <h2 className="block-h">Fundraisers</h2>
        <p className="block-sub">Every fundraiser lives inside a community. Step into one to help.</p>
        <div className="world-grid">
          {causes.map((f) => (
            <CauseCard key={f.id} f={f} raised={site.raisedFor(f.id)} onClick={() => site.goCause(f.id)} />
          ))}
        </div>
      </section>
    </div>
  );
}
