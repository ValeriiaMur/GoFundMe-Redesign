/** Deterministic pseudo-random in [0,1) so ambient elements don't reshuffle on render. */
export function seeded(i: number): number {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

/** Clamped linear interpolation. */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

/**
 * Round to a fixed number of decimals, returning a number.
 * Use for any value emitted into inline-style CSS: full-precision floats get
 * re-rounded by the browser's CSS parser, which diverges from React's client
 * value and trips a hydration mismatch. A short, stable string avoids it.
 */
export function fixed(n: number, dp = 3): number {
  return Number(n.toFixed(dp));
}
