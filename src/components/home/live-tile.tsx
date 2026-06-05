import type { Community } from "@/lib/data";
import { Avatar } from "@/components/shared/avatar";

/** "On watch now" tile: who's keeping watch tonight. */
export function LiveTile({ community }: { community: Community }) {
  return (
    <article className="tile tile-area-live tile-live">
      <div className="tile-content tile-live-col">
        <div className="tile-live-head">
          <span className="live-dot" />
          <span className="tile-live-title">On watch now</span>
        </div>
        <div className="tile-live-faces">
          {community.stewards.map((p) => (
            <span key={p.id}>
              <Avatar person={p} size={30} />
            </span>
          ))}
        </div>
        <p className="tile-live-line">
          <b>31</b> neighbors are watching the ridgelines tonight.{" "}
          <span className="lq">&ldquo;Quiet so far.&rdquo;</span>
        </p>
      </div>
    </article>
  );
}
