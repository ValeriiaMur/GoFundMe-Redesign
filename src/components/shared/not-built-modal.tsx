"use client";

import { useEffect, useRef, useState } from "react";

import { Modal } from "@/components/shared/modal";
import { Btn } from "@/components/shared/btn";

export interface NotBuiltModalProps {
  onClose: () => void;
}

type Phase = "unlit" | "flicker" | "smoke";

const MATCH_LABEL: Record<Phase, string> = {
  unlit: "Strike a match",
  flicker: "It’s catching…",
  smoke: "…and it’s out.",
};

/** Tongue-in-cheek "oops" modal for features the demo hasn't built: the brand
 *  lantern, unlit. Striking a match makes it catch hopefully — then puff out. */
export function NotBuiltModal({ onClose }: NotBuiltModalProps) {
  const [phase, setPhase] = useState<Phase>("unlit");
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const strike = () => {
    if (phase !== "unlit") return;
    setPhase("flicker");
    timers.current.push(window.setTimeout(() => setPhase("smoke"), 1400));
    timers.current.push(window.setTimeout(() => setPhase("unlit"), 3000));
  };

  return (
    <Modal onClose={onClose}>
      <div className="modal-center">
        <div className="modal-kicker">Oops… oh no</div>
        <h3 className="modal-title">This lantern isn&rsquo;t lit yet.</h3>
        <p className="modal-sub">
          Yes, it&rsquo;s a demo — and starting a fundraiser wasn&rsquo;t in scope. The flame is
          still on order.
        </p>
        <div className="unlit-stage" data-phase={phase} aria-hidden>
          <span className="unlit-smoke" />
          <span className="unlit-flame" />
          <div className="unlit-lantern" />
        </div>
        <button className="lhero-link unlit-match" onClick={strike} disabled={phase !== "unlit"}>
          {MATCH_LABEL[phase]}
        </button>
        <Btn kind="ink" size="lg" className="modal-cta" onClick={onClose}>
          Back to the light
        </Btn>
        <div className="modal-fine">A demo — every lantern in its time.</div>
      </div>
    </Modal>
  );
}
