/** Deterministic pseudo-random in [0,1) so ambient elements don't reshuffle on render. */
export function seeded(i: number): number {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

/** Clamped linear interpolation. */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}
