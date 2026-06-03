"use client";

import { listCommunities } from "@/lib/structure";
import { useSite } from "@/components/app/site-provider";
import { CommunityTile } from "@/components/home/community-tile";

/** The "list of all" communities — the menu destination. Click a tile → community detail. */
export function CommunitiesIndex() {
  const site = useSite();
  const communities = listCommunities();

  return (
    <div className="page page-index">
      <section className="block discover-hero">
        <p className="kicker">COMMUNITIES</p>
        <h1 className="discover-h">Find a community to stand with.</h1>
        <p className="discover-sub">
          Every community gathers around the fundraisers its members care about. Step inside one to
          see its causes.
        </p>
      </section>

      <section className="block">
        <h2 className="block-h">All communities</h2>
        <p className="block-sub">{communities.length} gathering right now.</p>
        <div className="world-grid">
          {communities.map((c) => (
            <CommunityTile key={c.id} community={c} onClick={() => site.goCommunity(c.handle)} />
          ))}
        </div>
      </section>
    </div>
  );
}
