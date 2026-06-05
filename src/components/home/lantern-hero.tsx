"use client";

import { useCallback, useRef, useState } from "react";

import { LANTERN_FRAME_COUNT, heroOverlayAt, staticFrameSrc } from "@/lib/lantern";
import { causesOf, listCommunities } from "@/lib/structure";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useLanternScrub } from "@/hooks/use-lantern-scrub";
import { useSite } from "@/components/app/site-provider";
import { LanternBeats, type HeroStats } from "@/components/home/lantern-beats";
import { LanternSparks } from "@/components/home/lantern-sparks";
import { LanternLoader } from "@/components/home/lantern-loader";
import { WorldGrow } from "@/components/shared/world-grow";
import { NotBuiltModal } from "@/components/shared/not-built-modal";

const HERO_ALT = "Hands release a glowing paper lantern into a wisteria-draped dawn sky";

/** Mutates an overlay layer from the rAF loop (no React re-renders). */
function setLayer(el: HTMLElement | null, opacity: number, y: number, centered: boolean) {
  if (!el) return;
  el.style.opacity = opacity.toFixed(3);
  el.style.transform = centered
    ? `translateY(calc(-50% + ${y.toFixed(1)}px))`
    : `translateY(${y.toFixed(1)}px)`;
  el.style.pointerEvents = opacity < 0.06 ? "none" : "auto";
}

/**
 * Scroll-scrubbed hero (design handoff "Hero Redesign"): a pinned canvas plays
 * the lantern-release frame sequence mapped to scroll, with three messaging
 * beats, a flame flicker, drifting sparks, slide dots and a featured rail.
 * Reduced motion gets the static held-and-glowing pose.
 */
export function LanternHero() {
  const reduced = usePrefersReducedMotion();
  const site = useSite();
  const [oops, setOops] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beat1Ref = useRef<HTMLDivElement>(null);
  const beat2Ref = useRef<HTMLDivElement>(null);
  const beat3Ref = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const bubblesRef = useRef<HTMLDivElement>(null);

  const community = listCommunities()[0];
  const raised = causesOf(community).reduce((sum, f) => sum + site.raisedFor(f.id), 0);
  const stats: HeroStats = {
    neighbors: community.members.toLocaleString("en-US"),
    raisedK: `$${Math.round(raised / 1000)}`,
    lanterns: site.lanternsFor(community.id).toLocaleString("en-US"),
  };

  const onProgress = useCallback((p: number) => {
    const o = heroOverlayAt(p);
    setLayer(beat1Ref.current, o.beat1, o.beat1Y, false);
    setLayer(beat2Ref.current, o.beat2, o.beat2Y, true);
    setLayer(beat3Ref.current, o.beat3, o.beat3Y, true);
    if (railRef.current) {
      railRef.current.style.opacity = o.rail.toFixed(3);
      railRef.current.style.pointerEvents = o.rail < 0.06 ? "none" : "auto";
    }
    if (cueRef.current) cueRef.current.style.opacity = o.cue.toFixed(3);
    if (bubblesRef.current) {
      const kids = bubblesRef.current.children;
      for (let i = 0; i < kids.length; i++) kids[i].classList.toggle("on", i === o.activeBeat);
    }
  }, []);

  const { loaded, ready } = useLanternScrub(rootRef, canvasRef, !reduced, onProgress);
  const pct = Math.round((loaded / LANTERN_FRAME_COUNT) * 100);

  const lightLantern = () => site.openDonate(community.fundraisers[0]);
  const sendLantern = () => site.openLantern({ kind: "community", id: community.id });
  const explore = () => {
    const el = document.querySelector(".home-sections");
    if (el) window.scrollTo({ top: (el as HTMLElement).offsetTop - 60, behavior: "smooth" });
  };

  const beats = (staticMode: boolean) => (
    <LanternBeats
      pulse={community.pulse || undefined}
      stats={stats}
      beat1Ref={beat1Ref}
      beat2Ref={beat2Ref}
      beat3Ref={beat3Ref}
      staticMode={staticMode}
      onStart={() => setOops(true)}
      onLightLantern={lightLantern}
      onExplore={explore}
      onSendLantern={sendLantern}
    />
  );

  if (reduced) {
    return (
      <section className="lhero-wrap" data-static="1">
        <div className="lhero-pin on-media">
          <div className="lhero-backdrop" aria-hidden />
          {/* eslint-disable-next-line @next/next/no-img-element -- full-bleed hero frame sized by CSS, not the image pipeline */}
          <img className="lhero-still" src={staticFrameSrc()} alt={HERO_ALT} />
          <WorldGrow progress={0.8} intensity={0.9} accent={community.accent} />
          <div className="lhero-scrim-left" aria-hidden />
          <div className="lhero-scrim-bottom" aria-hidden />
          {beats(true)}
          <div className="lhero-dissolve" aria-hidden />
        </div>
        {oops && <NotBuiltModal onClose={() => setOops(false)} />}
      </section>
    );
  }

  return (
    <section className="lhero-wrap" ref={rootRef} data-static="0">
      <LanternLoader pct={pct} done={ready} />
      <div className="lhero-pin on-media">
        <div className="lhero-backdrop" aria-hidden />
        <canvas className="lhero-canvas" ref={canvasRef} role="img" aria-label={HERO_ALT} />
        <div className="lhero-flicker" aria-hidden />
        <LanternSparks />
        <WorldGrow progress={0.8} intensity={0.9} accent={community.accent} />
        <div className="lhero-scrim-left" aria-hidden />
        <div className="lhero-scrim-bottom" aria-hidden />
        {beats(false)}
        <div className="lhero-rail" ref={railRef}>
          <div className="lhero-rail-meta">
            <span className="lhero-rail-label">Featured community</span>
            <span className="lhero-rail-name">{community.name}</span>
          </div>
        </div>
        <div className="lhero-bubbles" ref={bubblesRef} aria-hidden>
          <span className="lhero-bubble on" />
          <span className="lhero-bubble" />
          <span className="lhero-bubble" />
        </div>
        <div className="lhero-dissolve" aria-hidden />
        <div className="lhero-cue" ref={cueRef} aria-hidden>
          <span>Scroll to release</span>
          <span className="bar" />
        </div>
      </div>
      {oops && <NotBuiltModal onClose={() => setOops(false)} />}
    </section>
  );
}
