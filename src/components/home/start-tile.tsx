"use client";

import { useState } from "react";

import { NotBuiltModal } from "@/components/shared/not-built-modal";

/** Ink CTA tile closing the bento: start a fundraiser (opens the not-built modal). */
export function StartTile() {
  const [oops, setOops] = useState(false);

  return (
    <>
      <button className="tile tile-area-start tile-start" onClick={() => setOops(true)}>
        <div className="tile-start-top">
          <span className="tile-start-kicker">Your turn</span>
          <span className="tile-start-arrow">↗</span>
        </div>
        <div>
          <h3 className="tile-start-h">Start a fundraiser</h3>
          <p className="tile-start-sub">Every place here began with one neighbor deciding not to wait.</p>
        </div>
      </button>
      {oops && <NotBuiltModal onClose={() => setOops(false)} />}
    </>
  );
}
