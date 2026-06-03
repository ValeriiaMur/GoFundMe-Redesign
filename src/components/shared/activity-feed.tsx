import { type ReactNode } from "react";

import { money, type Activity } from "@/lib/data";
import { Avatar } from "@/components/shared/avatar";

function actVerb(a: Activity): ReactNode {
  switch (a.type) {
    case "donate":
      return <>planted <b>{money(a.amount ?? 0)}</b></>;
    case "lantern":
      return <>sent a lantern</>;
    case "follow":
      return <>started keeping watch</>;
    case "milestone":
      return <>a milestone was reached</>;
    case "join":
      return <>joined the watch</>;
    case "update":
      return <>posted an update</>;
    default:
      return a.type;
  }
}

const ACT_HUE: Record<Activity["type"], number> = {
  donate: 52,
  lantern: 88,
  follow: 168,
  milestone: 52,
  join: 210,
  update: 300,
};

export interface ActivityFeedProps {
  items: Activity[];
  title?: string;
  accent?: number;
  onItem?: (a: Activity) => void;
}

/** The living feed of recent supporter actions. */
export function ActivityFeed({ items, title = "Living feed", accent = 52, onItem }: ActivityFeedProps) {
  return (
    <div className="feed">
      <div className="feed-head">
        <span className="live-dot" /> <span className="feed-title">{title}</span>
      </div>
      <div className="feed-list">
        {items.map((a) => (
          <button key={a.id} type="button" className="feed-item" onClick={() => onItem?.(a)}>
            <Avatar person={a.who} size={34} />
            <div className="feed-body">
              <div className="feed-line">
                <b className="feed-who">{a.who.name.split(" ")[0]}</b> {actVerb(a)}
                <span
                  className="feed-dot"
                  style={{ background: `oklch(0.78 0.15 ${ACT_HUE[a.type] ?? accent})` }}
                />
              </div>
              {a.msg && a.type !== "milestone" && a.type !== "update" && (
                <div className="feed-msg">&ldquo;{a.msg}&rdquo;</div>
              )}
              {(a.type === "milestone" || a.type === "update") && a.msg && (
                <div className="feed-meta">{a.msg}</div>
              )}
              <div className="feed-at">{a.at}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
