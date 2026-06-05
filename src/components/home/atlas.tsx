"use client";

import { causesOf, listCommunities } from "@/lib/structure";
import { useSite } from "@/components/app/site-provider";
import { WatchTile } from "@/components/home/watch-tile";
import { CauseTile } from "@/components/home/cause-tile";
import { LanternTile } from "@/components/home/lantern-tile";
import { LiveTile } from "@/components/home/live-tile";
import { ImpactTile } from "@/components/home/impact-tile";
import { StartTile } from "@/components/home/start-tile";

const AREAS = ["alerts", "shelter", "replant"] as const;

/** The bento atlas of live fundraisers below the hero. */
export function Atlas() {
  const site = useSite();
  const community = listCommunities()[0];
  const causes = causesOf(community);
  const raised = causes.reduce((sum, f) => sum + site.raisedFor(f.id), 0);
  const [first, second, third] = causes;

  return (
    <section className="atlas">
      <div className="atlas-grid">
        <WatchTile
          community={community}
          raised={raised}
          onEnter={() => site.goCommunity(community.handle)}
        />
        <CauseTile
          cause={first}
          raised={site.raisedFor(first.id)}
          area={AREAS[0]}
          onOpen={() => site.goCause(first.id)}
        />
        <CauseTile
          cause={second}
          raised={site.raisedFor(second.id)}
          area={AREAS[1]}
          onOpen={() => site.goCause(second.id)}
        />
        <LanternTile community={community} lanterns={site.lanternsFor(community.id)} />
        <CauseTile
          cause={third}
          raised={site.raisedFor(third.id)}
          area={AREAS[2]}
          onOpen={() => site.goCause(third.id)}
        />
        <LiveTile community={community} />
        <ImpactTile raised={raised} />
        <StartTile />
      </div>
    </section>
  );
}
