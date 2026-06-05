/** Centered impact number: everything raised stays local. */
export function ImpactTile({ raised }: { raised: number }) {
  return (
    <article className="tile tile-area-impact tile-impact">
      <div className="tile-content tile-impact-col">
        <span className="tile-impact-num">
          ${Math.round(raised / 1000)}
          <span className="unit">K</span>
        </span>
        <span className="tile-impact-label">raised, all of it local</span>
        <span className="tile-impact-note">100% goes to the canyon. No platform fees taken here.</span>
      </div>
    </article>
  );
}
