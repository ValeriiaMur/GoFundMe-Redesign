"use client";

import { type CSSProperties, type ReactNode, useEffect } from "react";

export interface ModalProps {
  children: ReactNode;
  onClose: () => void;
  accent?: number;
}

/** Centered modal with scrim; closes on Escape or backdrop click. */
export function Modal({ children, onClose, accent = 52 }: ModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="modal-scrim" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        style={{ "--accent": `oklch(0.74 0.15 ${accent})` } as CSSProperties}
      >
        <button className="modal-x" onClick={onClose} aria-label="Close">
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
