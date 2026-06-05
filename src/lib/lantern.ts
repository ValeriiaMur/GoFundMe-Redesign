/** The lantern hero (design handoff "Hero Redesign"): hands release a glowing
 *  lantern into a dawn sky, scroll-scrubbed across 8 WebP frames with three
 *  messaging beats. Pure math for the canvas + overlay choreography. */

export const LANTERN_FRAME_COUNT = 8;

/** Horizontal focal bias for cover-fitting frames (the lantern sits right of center). */
export const HERO_FOCAL = 0.62;

/** Static pose for reduced motion: the "held & glowing" frame reads far
 *  stronger as a hero than the literal last frame (a distant dot). */
export const STATIC_PROGRESS = 0.16;

/** Public path for a 0-based frame index → `/hero/lantern/frame-001.webp`… */
export function lanternFrameSrc(index: number): string {
  return `/hero/lantern/frame-${String(index + 1).padStart(3, "0")}.webp`;
}

/** The frame shown when the scrub is disabled (reduced motion). */
export function staticFrameSrc(): string {
  return lanternFrameSrc(Math.round(STATIC_PROGRESS * (LANTERN_FRAME_COUNT - 1)));
}

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/** Smoothstep easing used across the hero choreography. */
export const ease = (t: number) => t * t * (3 - 2 * t);

/** Remaps `x` into 0–1 across the `[a, b]` band, clamped. */
export const band = (x: number, a: number, b: number) => clamp01((x - a) / (b - a));

export interface FrameBlend {
  /** Frame drawn fully opaque. */
  from: number;
  /** Frame crossfaded on top. */
  to: number;
  /** Eased opacity of `to`, 0–1, so a sparse sequence feels liquid. */
  mix: number;
}

/** Maps scroll progress (0–1) onto a crossfade between adjacent frames. */
export function frameBlendAt(progress: number, count = LANTERN_FRAME_COUNT): FrameBlend {
  const pos = clamp01(progress) * (count - 1);
  const from = Math.floor(pos);
  const to = Math.min(count - 1, from + 1);
  return { from, to, mix: ease(pos - from) };
}

export interface HeroOverlay {
  /** Opacity of each beat: holds → release → flies high. */
  beat1: number;
  beat2: number;
  beat3: number;
  /** Vertical drift (px) per beat. */
  beat1Y: number;
  beat2Y: number;
  beat3Y: number;
  /** Featured-community rail opacity (fades out early). */
  rail: number;
  /** "Scroll to release" cue opacity. */
  cue: number;
  /** Which slide dot is lit. */
  activeBeat: 0 | 1 | 2;
}

/** The three-act overlay choreography, computed from scroll progress. */
export function heroOverlayAt(p: number, motion = 1): HeroOverlay {
  const beat1 = 1 - ease(band(p, 0.3, 0.46));
  const beat2 = ease(band(p, 0.4, 0.54)) * (1 - ease(band(p, 0.66, 0.78)));
  const beat3 = ease(band(p, 0.7, 0.86));
  return {
    beat1,
    beat2,
    beat3,
    beat1Y: -p * 60 * motion,
    beat2Y: (0.5 - band(p, 0.4, 0.78)) * 40 * motion,
    beat3Y: (1 - beat3) * 36 * motion,
    rail: 1 - ease(band(p, 0.16, 0.32)),
    cue: 1 - ease(band(p, 0, 0.1)),
    activeBeat: p < 0.46 ? 0 : p < 0.7 ? 1 : 2,
  };
}
