"use client";

import { COMMUNITIES, FUNDRAISERS, money } from "@/lib/data";
import { getWorld } from "@/lib/worlds";
import { useSite } from "@/components/app/site-provider";
import { WorldVideo } from "@/components/world/world-video";
import { WorldGrow } from "@/components/shared/world-grow";
import { Btn } from "@/components/shared/btn";
import { ActivityFeed } from "@/components/shared/activity-feed";
import { CauseCard } from "@/components/community/cause-card";
import { StewardList } from "@/components/community/steward-list";

export function CommunityPage({ id = "watch" }: { id?: string }) {
  const site = useSite();
  const c = COMMUNITIES[id];
  if (!c) return null;

  const fundraisers = c.fundraisers.map((fid) => FUNDRAISERS[fid]);
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
        <div className="chero-overlay">
          <div className="chero-pulse">
            <span className="live-dot" /> {c.pulse}
          </div>
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
            <Btn kind="ghost" accent={c.accent} onClick={() => site.openLantern({ kind: "community", id: c.id })}>
              Send a lantern
            </Btn>
          </div>
        </div>
      </section>

      <div className="cbody">
        <main className="cbody-main">
          <section className="block">
            <h2 className="block-h">Causes alight in this watch</h2>
            <p className="block-sub">
              Every light planted here grows the whole watershed. {money(totalRaised)} of {money(totalGoal)} together.
            </p>
            <div className="world-grid">
              {fundraisers.map((f) => (
                <CauseCard key={f.id} f={f} raised={site.raisedFor(f.id)} onClick={() => site.goFundraiser(f.id)} />
              ))}
            </div>
          </section>

          <section className="block">
            <h2 className="block-h">Who we are</h2>
            <p className="prose-inline">{c.about}</p>
          </section>
        </main>

        <aside className="cbody-side">
          <div className="side-card">
            <ActivityFeed
              items={site.feed.slice(0, 8)}
              title="The watch right now"
              accent={c.accent}
              onItem={(a) => {
                if (FUNDRAISERS[a.target]) site.goFundraiser(a.target);
              }}
            />
          </div>
          <div className="side-card">
            <div className="side-h">Stewards</div>
            <StewardList stewards={c.stewards} onSelect={site.goProfile} />
          </div>
        </aside>
      </div>
    </div>
  );
}
