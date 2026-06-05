import { cn } from "@/lib/utils";

export interface LanternLoaderProps {
  /** Preload percentage, 0–100. */
  pct: number;
  /** Fades the loader away once the sequence is decoded. */
  done: boolean;
}

/** Full-screen dawn preloader shown until the frame sequence decodes. */
export function LanternLoader({ pct, done }: LanternLoaderProps) {
  return (
    <div
      className={cn("lhero-loader", done && "gone")}
      role="progressbar"
      aria-label="Loading the lantern"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      aria-hidden={done}
    >
      <div className="lhero-loader-mark">
        <span className="spark" />
        GoFundMe
      </div>
      <div className="lhero-loader-tag">Help finds a way</div>
      <div className="lhero-loader-bar">
        <div className="lhero-loader-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="lhero-loader-pct">{pct}%</div>
    </div>
  );
}
