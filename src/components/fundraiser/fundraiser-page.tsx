"use client";

import { FUNDRAISERS, PROFILES } from "@/lib/data";
import { communityOf } from "@/lib/structure";
import { useSite } from "@/components/app/site-provider";
import { FundraiserHero } from "@/components/fundraiser/fundraiser-hero";
import { SiblingCard } from "@/components/fundraiser/sibling-card";
import { UpdateCard } from "@/components/fundraiser/update-card";
import { ScrollyStory } from "@/components/shared/scrolly-story";
import { MilestoneTrail } from "@/components/shared/milestone-trail";
import { ProgressMeter } from "@/components/shared/progress-meter";
import { ActivityFeed } from "@/components/shared/activity-feed";
import { ActionBar } from "@/components/shared/action-bar";

export function FundraiserPage({ id }: { id: string }) {
  const site = useSite();
  const f = FUNDRAISERS[id];
  if (!f) return null;

  const raised = site.raisedFor(id);
  const lanterns = site.lanternsFor(id);
  const state = { followed: !!site.followedById[id], lanternSent: false };
  const on = {
    donate: () => site.openDonate(id),
    follow: () => site.follow(id),
    lantern: () => site.openLantern({ kind: "fundraiser", id }),
  };
  const feed = site.feed.filter((a) => a.target === id || a.who.id === PROFILES.janahan.id);
  const community = communityOf(f);
  const siblings = f.community
    ? Object.values(FUNDRAISERS).filter((s) => s.community === f.community && s.id !== f.id)
    : [];

  return (
    <div className="page page-fundraiser">
      <FundraiserHero f={f} raised={raised} state={state} on={on} intensity={1} />

      <ScrollyStory f={f} intensity={1} />

      <div className="fbody">
        <main className="fbody-main">
          <section className="block">
            <h2 className="block-h">The road ahead</h2>
            <MilestoneTrail milestones={f.milestones} raised={raised} accent={f.accent} />
          </section>

          <section className="block">
            <h2 className="block-h">Updates from the watch</h2>
            <div className="updates">
              {f.updates.map((u) => (
                <UpdateCard key={u.id} update={u} />
              ))}
            </div>
          </section>

          {siblings.length > 0 && (
            <section className="block">
              <h2 className="block-h">
                Part of{" "}
                {community ? (
                  <button className="inline-link" onClick={() => site.goCommunity(community.handle)}>
                    {community.name}
                  </button>
                ) : (
                  "the same watch"
                )}
              </h2>
              <div className="sibling-row">
                {siblings.map((s) => (
                  <SiblingCard
                    key={s.id}
                    f={s}
                    raised={site.raisedFor(s.id)}
                    onClick={() => site.goCause(s.id)}
                  />
                ))}
              </div>
            </section>
          )}
        </main>

        <aside className="fbody-side">
          <div className="side-card sticky">
            <ProgressMeter raised={raised} goal={f.goal} accent={f.accent} supporters={f.supporters} />
            <div className="side-stats">
              <div>
                <b>{lanterns}</b>
                <span>lanterns</span>
              </div>
              <div>
                <b>{f.followers.toLocaleString()}</b>
                <span>watching</span>
              </div>
              <div>
                <b>{f.daysLeft}</b>
                <span>days left</span>
              </div>
            </div>
            <ActionBar fundraiser={f} state={state} on={on} compact />
          </div>
          <div className="side-card">
            <ActivityFeed items={feed.slice(0, 6)} accent={f.accent} />
          </div>
        </aside>
      </div>
    </div>
  );
}
