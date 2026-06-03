import type { Fundraiser } from "@/lib/data";
import { getWorld } from "@/lib/worlds";
import { WorldVideo } from "@/components/world/world-video";
import { WorldGrow } from "@/components/shared/world-grow";
import { Avatar } from "@/components/shared/avatar";
import { ProgressMeter } from "@/components/shared/progress-meter";
import { ActionBar, type ActionHandlers, type ActionState } from "@/components/shared/action-bar";

export interface FundraiserHeroProps {
  f: Fundraiser;
  raised: number;
  state: ActionState;
  on: ActionHandlers;
  intensity?: number;
}

/** Immersive full-bleed hero: the cause's world with title, meter, and actions. */
export function FundraiserHero({ f, raised, state, on, intensity = 1 }: FundraiserHeroProps) {
  const progress = Math.min(1, raised / f.goal);
  return (
    <section className="fhero immersive">
      <div className="hero-world">
        <WorldVideo world={getWorld(f.world)} priority dim={0.34} />
        <WorldGrow progress={progress} intensity={intensity} accent={f.accent} />
      </div>
      <div className="fhero-overlay">
        <div className="hero-meta">
          <h1 className="hero-title">{f.title}</h1>
          <p className="hero-blurb">{f.blurb}</p>
          <div className="hero-org">
            <Avatar person={f.organizer} size={34} />
            <div>
              <span className="dim">Organized by</span> <b>{f.organizer.name}</b>
            </div>
          </div>
          <div className="hero-progress">
            <ProgressMeter raised={raised} goal={f.goal} accent={f.accent} supporters={f.supporters} />
          </div>
          <ActionBar fundraiser={f} state={state} on={on} />
        </div>
      </div>
      <div className="scrolldown">scroll</div>
    </section>
  );
}
