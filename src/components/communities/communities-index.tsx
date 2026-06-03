"use client";

import type { Community } from "@/lib/data";
import { causesOf, listCommunities } from "@/lib/structure";
import { useSite } from "@/components/app/site-provider";
import { Doorway } from "@/components/communities/doorway";

/** The "list of all" communities — the menu destination, wired to live site state. */
export function CommunitiesIndex() {
  const site = useSite();
  const communities = listCommunities();

  const raisedOf = (c: Community) =>
    causesOf(c).reduce((sum, f) => sum + site.raisedFor(f.id), 0);
  const progressOf = (c: Community) => {
    const causes = causesOf(c);
    const goal = causes.reduce((sum, f) => sum + f.goal, 0);
    return goal > 0 ? Math.min(1, raisedOf(c) / goal) : 0.5;
  };

  return (
    <Doorway
      communities={communities}
      raisedOf={raisedOf}
      progressOf={progressOf}
      onEnter={site.goCommunity}
    />
  );
}
