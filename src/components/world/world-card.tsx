import { WorldVideo } from "@/components/world/world-video";
import type { WorldSource } from "@/lib/worlds";

export interface WorldCardProps {
  world: WorldSource;
  title: string;
  blurb?: string;
}

/** A cause "world" preview card — the clip lazy-loads as it scrolls into view. */
export function WorldCard({ world, title, blurb }: WorldCardProps) {
  return (
    <article className="group overflow-hidden rounded-[18px] border border-white/10 bg-white/[0.02] transition-transform duration-200 hover:-translate-y-1">
      <div className="relative h-44">
        <WorldVideo world={world} lazy dim={0.15} />
        <span className="absolute bottom-3 left-3 z-10 rounded-full bg-black/50 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white backdrop-blur">
          {world.name}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold leading-tight">{title}</h3>
        {blurb && <p className="mt-2 text-sm text-muted-foreground">{blurb}</p>}
      </div>
    </article>
  );
}
