"use client";

import { useState } from "react";

import { Modal } from "@/components/shared/modal";
import { Btn } from "@/components/shared/btn";

export interface LanternModalProps {
  onClose: () => void;
  onConfirm: (message: string) => void;
}

/** "Send a lantern" — share a cause with a wish attached. */
export function LanternModal({ onClose, onConfirm }: LanternModalProps) {
  const [msg, setMsg] = useState("");
  return (
    <Modal onClose={onClose} accent={88}>
      <div className="modal-kicker">Send a lantern</div>
      <h3 className="modal-title">Carry this cause to someone.</h3>
      <p className="modal-sub">
        A lantern is a share with a wish attached. It floats up in this world and lands in their feed.
      </p>
      <div className="lantern-preview">
        <div className="lantern-big" />
        <div className="lantern-note">{msg || "Keep watch with me."}</div>
      </div>
      <textarea
        className="modal-input"
        placeholder="Your wish…"
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
      />
      <Btn kind="primary" accent={88} size="lg" className="modal-cta" onClick={() => onConfirm(msg)}>
        Release the lantern
      </Btn>
      <div className="modal-fine">A demo — copies a shareable link.</div>
    </Modal>
  );
}
