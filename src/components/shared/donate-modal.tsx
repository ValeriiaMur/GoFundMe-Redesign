"use client";

import { useEffect, useState } from "react";

import { money, type Fundraiser } from "@/lib/data";
import { track } from "@/lib/analytics";
import { Modal } from "@/components/shared/modal";
import { Btn } from "@/components/shared/btn";

export interface DonateModalProps {
  fundraiser: Fundraiser;
  onClose: () => void;
  onConfirm: (amount: number, message: string) => void;
}

/** "Plant a light" — pick an amount and leave a note. */
export function DonateModal({ fundraiser, onClose, onConfirm }: DonateModalProps) {
  const presets = [25, 75, 150, 500];
  const [amt, setAmt] = useState(75);
  const [msg, setMsg] = useState("");
  const [custom, setCustom] = useState("");
  const value = custom ? parseInt(custom, 10) || 0 : amt;

  // Top of the donate funnel: intent. Pairs with `donate` to measure drop-off.
  useEffect(() => {
    track({
      name: "donate_modal_opened",
      props: { causeId: fundraiser.id, communityId: fundraiser.community },
    });
  }, [fundraiser.id, fundraiser.community]);

  return (
    <Modal onClose={onClose} accent={fundraiser.accent}>
      <div className="modal-kicker">Plant a light</div>
      <h3 className="modal-title">Your light becomes part of {fundraiser.title.toLowerCase()}.</h3>
      <p className="modal-sub">Every light you plant makes this world grow — visibly, for everyone watching.</p>
      <div className="amt-grid">
        {presets.map((p) => (
          <button
            key={p}
            className={"amt " + (!custom && amt === p ? "on" : "")}
            onClick={() => {
              setAmt(p);
              setCustom("");
            }}
          >
            {money(p)}
          </button>
        ))}
        <input
          className="amt amt-custom"
          placeholder="Other"
          inputMode="numeric"
          value={custom}
          onChange={(e) => setCustom(e.target.value.replace(/[^0-9]/g, ""))}
        />
      </div>
      <textarea
        className="modal-input"
        placeholder="Leave a note for the watch (optional)"
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
      />
      <Btn kind="primary" accent={fundraiser.accent} size="lg" className="modal-cta" onClick={() => onConfirm(value, msg)}>
        <span className="btn-spark" /> Plant {money(value || 0)}
      </Btn>
      <div className="modal-fine">A demo — no payment is taken.</div>
    </Modal>
  );
}
