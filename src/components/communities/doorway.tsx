"use client";

import { useState, type CSSProperties } from "react";

import type { Community } from "@/lib/data";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { DoorwayFeature } from "@/components/communities/doorway-feature";
import { DoorwayTile } from "@/components/communities/doorway-tile";

export interface DoorwayProps {
  communities: Community[];
  raisedOf: (c: Community) => number;
  progressOf: (c: Community) => number;
  onEnter: (handle: string) => void;
}

/**
 * The communities index as a living master-detail "doorway": hover/select a
 * community on the right to preview it in the feature panel (and hero) in place.
 * With a single community the panel renders full-width and the list is hidden.
 */
export function Doorway({ communities, raisedOf, progressOf, onEnter }: DoorwayProps) {
  const [previewedIndex, setPreviewedIndex] = useState(0);
  const previewed = communities[previewedIndex] ?? communities[0];
  if (!previewed) return null;

  const solo = communities.length < 2;

  return (
    <div className="page page-index">
      <header className="idx-intro">
        <h1 className="idx-intro-h">Find a community to stand with.</h1>
        <p className="idx-intro-sub">
          Every community gathers around the fundraisers its members care about. Step inside one to
          see its causes.
        </p>
      </header>

      <div className="idx-body">
        <div className="idx-head">
          <p className="kicker" style={{ "--accent": "var(--ember)" } as CSSProperties}>
            All communities
          </p>
          <h2 className="block-h">{communities.length} gathering right now</h2>
          <p className="block-sub">
            {solo
              ? "Step inside to see its causes."
              : "Hover a community to preview it on the left. The doorway lights up with whoever's inside."}
          </p>
        </div>
        <div className={cn("idx-grid", solo && "solo")}>
          <DoorwayFeature
            community={previewed}
            raised={raisedOf(previewed)}
            progress={progressOf(previewed)}
            onEnter={() => onEnter(previewed.handle)}
          />
          {!solo && (
            <div className="idx-list">
              {communities.map((c, i) => (
                <DoorwayTile
                  key={c.id}
                  community={c}
                  raised={raisedOf(c)}
                  active={i === previewedIndex}
                  onPreview={() => {
                    if (i !== previewedIndex) {
                      track({ name: "preview_community", props: { communityId: c.id } });
                    }
                    setPreviewedIndex(i);
                  }}
                  onEnter={() => onEnter(c.handle)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
