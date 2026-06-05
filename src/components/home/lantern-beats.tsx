"use client";

import type { RefObject } from "react";

import { Btn } from "@/components/shared/btn";

export interface HeroStats {
  neighbors: string;
  raisedK: string;
  lanterns: string;
}

export interface LanternBeatsProps {
  /** Featured community pulse line (omitted when empty). */
  pulse?: string;
  stats: HeroStats;
  /** Refs mutated by the scroll choreography (opacity/translate). */
  beat1Ref: RefObject<HTMLDivElement | null>;
  beat2Ref: RefObject<HTMLDivElement | null>;
  beat3Ref: RefObject<HTMLDivElement | null>;
  /** When true (static / reduced-motion), only beat 1 renders, fully visible. */
  staticMode?: boolean;
  onStart: () => void;
  onLightLantern: () => void;
  onExplore: () => void;
  onSendLantern: () => void;
}

/** The hero's three messaging beats: holds → release → flies high. */
export function LanternBeats({
  pulse,
  stats,
  beat1Ref,
  beat2Ref,
  beat3Ref,
  staticMode = false,
  onStart,
  onLightLantern,
  onExplore,
  onSendLantern,
}: LanternBeatsProps) {
  return (
    <div className="lhero-overlay">
      <div className="lhero-stage">
        {/* BEAT 1 — hands hold the lantern */}
        <div className="lhero-beat lhero-beat-1" ref={beat1Ref}>
          {pulse && (
            <p className="lhero-pulse">
              <span className="live-dot" /> {pulse}
            </p>
          )}
          <h1 className="lhero-h">Start fundraising on GoFundMe</h1>
          <p className="lhero-tag">Help finds a way.</p>
          <div className="lhero-stats">
            <div className="lhero-stat">
              <b>{stats.neighbors}</b>
              <span>neighbors</span>
            </div>
            <div className="lhero-stat">
              <b>
                {stats.raisedK}
                <span className="unit">K</span>
              </b>
              <span>raised</span>
            </div>
            <div className="lhero-stat">
              <b>{stats.lanterns}</b>
              <span>lanterns</span>
            </div>
          </div>
          <div className="lhero-cta">
            <Btn kind="ink" size="lg" className="btn-lantern" onClick={onStart}>
              Start a GoFundMe
            </Btn>
            <button className="lhero-link" onClick={onExplore}>
              Explore communities <span className="btn-arrow">→</span>
            </button>
          </div>
        </div>

        {!staticMode && (
          <>
            {/* BEAT 2 — the release */}
            <div className="lhero-beat lhero-beat-2" ref={beat2Ref} aria-hidden>
              <h2 className="lhero-lift-line">
                Light a lantern — <span className="it">and let it lift.</span>
              </h2>
              <div className="lhero-cta">
                <Btn kind="ink" size="lg" className="btn-lantern" onClick={onLightLantern}>
                  Light a lantern
                </Btn>
              </div>
            </div>

            {/* BEAT 3 — it flies high */}
            <div className="lhero-beat lhero-beat-3" ref={beat3Ref} aria-hidden>
              <h2 className="lhero-rise-line">
                Follow the <span className="it">light.</span>
              </h2>
              <div className="lhero-rise-actions">
                <Btn kind="ink" size="lg" onClick={onExplore}>
                  Explore communities <span className="btn-arrow">→</span>
                </Btn>
                <button className="lhero-link" onClick={onSendLantern}>
                  Send this lantern ↑
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
