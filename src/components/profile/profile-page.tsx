"use client";

import { type CSSProperties } from "react";

import { COMMUNITIES, FUNDRAISERS, PROFILES, money } from "@/lib/data";
import { useSite } from "@/components/app/site-provider";
import { Avatar } from "@/components/shared/avatar";
import { Btn } from "@/components/shared/btn";
import { Constellation } from "@/components/profile/constellation";

export function ProfilePage({ handle }: { handle: string }) {
  const site = useSite();
  const p = PROFILES[handle];
  if (!p) return null;
  const first = p.name.split(" ")[0];

  return (
    <div className="page page-profile">
      <section className="phero">
        <Constellation nodes={p.constellation} onSelect={site.goNode} variant="hero" />
        <div className="phero-scrim" />
        <div className="phero-identity">
          <div className="phero-id">
            <div className="phero-avatar">
              <Avatar person={p} size={84} ring />
              <span className="home-pulse" />
            </div>
            <div className="phero-idtext">
              <h1 className="phero-name">{p.name}</h1>
              <div className="phero-handle">
                @{p.handle} · {p.role} of the watch
              </div>
              {p.onWatch && (
                <div className="phero-status">
                  <span className="live-dot" /> On watch · night shift
                </div>
              )}
            </div>
          </div>
          <p className="phero-bio">{p.bio}</p>
          <div className="phero-actions">
            <Btn kind="primary" accent={52} onClick={site.followPerson}>
              {site.followingPerson ? "Following ✓" : "Follow"}
            </Btn>
            <Btn kind="ghost" accent={52} onClick={() => site.openLantern({ kind: "person", id: p.id })}>
              Send a lantern
            </Btn>
            <span className="phero-joined">{p.joined}</span>
          </div>
          <div className="phero-stats">
            <div>
              <b>{money(p.stats.planted)}</b>
              <span>planted</span>
            </div>
            <div>
              <b>{p.stats.lanterns}</b>
              <span>lanterns sent</span>
            </div>
            <div>
              <b>{p.stats.watching}</b>
              <span>watching</span>
            </div>
            <div>
              <b>{p.streak}</b>
              <span>alerts verified</span>
            </div>
          </div>
        </div>
        <div className="phero-hint">Tap a light to travel there ✦</div>
      </section>

      <div className="pbody">
        <section className="block">
          <h2 className="block-h">What {first}&apos;s light became</h2>
          <p className="block-sub">
            Not numbers — outcomes. Every dollar planted turned into something real on the mountain.
          </p>
          <div className="impact-grid">
            {p.impact.map((im, i) => (
              <button
                key={i}
                className="impact-card"
                style={{ "--hue": im.accent } as CSSProperties}
                onClick={() =>
                  site.goNode({ id: im.cause, kind: COMMUNITIES[im.cause] ? "community" : "fundraiser" })
                }
              >
                <div className="impact-metric">{im.metric}</div>
                <div className="impact-outcome">{im.outcome}</div>
                <div className="impact-cause">
                  <span className="impact-dot" />{" "}
                  {FUNDRAISERS[im.cause] ? FUNDRAISERS[im.cause].title : "Wildfire Watch"}
                </div>
              </button>
            ))}
          </div>
        </section>

        <div className="pbody-cols">
          <section className="block">
            <h2 className="block-h">Lanterns for {first}</h2>
            <p className="block-sub">Wishes the watch sent back.</p>
            <div className="lwall">
              {p.lanternsReceived.map((l, i) => (
                <div key={i} className="lcard">
                  <span className="lcard-flame" />
                  <div className="lcard-body">
                    <p className="lcard-msg">&ldquo;{l.msg}&rdquo;</p>
                    <div className="lcard-from">
                      <Avatar person={l.from} size={24} /> {l.from.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="block">
            <h2 className="block-h">Moments</h2>
            <p className="block-sub">The story so far.</p>
            <div className="moments">
              {p.moments.map((m) => (
                <div key={m.id} className="moment">
                  <span className={"moment-mark mk-" + m.kind} />
                  <div className="moment-body">
                    <div className="moment-text">{m.text}</div>
                    <div className="moment-at">{m.at}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
