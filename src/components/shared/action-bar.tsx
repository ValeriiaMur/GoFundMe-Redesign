import { Btn } from "@/components/shared/btn";
import type { Fundraiser } from "@/lib/data";

export interface ActionState {
  followed: boolean;
  lanternSent: boolean;
}

export interface ActionHandlers {
  donate: () => void;
  follow: () => void;
  lantern: () => void;
}

export interface ActionBarProps {
  fundraiser: Fundraiser;
  state: ActionState;
  on: ActionHandlers;
  compact?: boolean;
}

/** The three meaningful actions: plant a light, keep watch, send a lantern. */
export function ActionBar({ fundraiser, state, on, compact = false }: ActionBarProps) {
  return (
    <div className={"actionbar " + (compact ? "compact" : "")}>
      <Btn kind="primary" accent={fundraiser.accent} size={compact ? "md" : "lg"} onClick={on.donate} className="grow">
        <span className="btn-spark" /> Plant a light
      </Btn>
      <Btn kind="ghost" accent={fundraiser.accent} onClick={on.follow}>
        {state.followed ? "Watching ✓" : "Keep watch"}
      </Btn>
      <Btn kind="ghost" accent={fundraiser.accent} onClick={on.lantern}>
        {state.lanternSent ? "Lantern sent" : "Send a lantern"}
      </Btn>
    </div>
  );
}
