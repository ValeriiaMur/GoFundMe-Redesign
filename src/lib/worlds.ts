/**
 * Manifest of the optimized ambient "world" clips.
 *
 * Each world ships as WebM (smaller, modern browsers) + MP4 (universal
 * fallback) plus a poster frame so the page paints before video loads.
 * Assets live in `public/worlds/` and are served statically from `/worlds/*`.
 */
export type WorldKey = "hand" | "signal" | "camp" | "pond" | "shop";

export interface WorldSource {
  /** Human label for the scene. */
  readonly name: string;
  /** Preferred modern-codec source. */
  readonly webm: string;
  /** Universal fallback source. */
  readonly mp4: string;
  /** Poster frame shown before/while the video loads. */
  readonly poster: string;
}

const make = (key: WorldKey, name: string): WorldSource => ({
  name,
  webm: `/worlds/${key}.webm`,
  mp4: `/worlds/${key}.mp4`,
  poster: `/worlds/${key}.jpg`,
});

const WORLDS: Record<WorldKey, WorldSource> = {
  hand: make("hand", "Outstretched hand"),
  signal: make("signal", "Signal in the dark"),
  camp: make("camp", "Starlit camp"),
  pond: make("pond", "Flowering pond"),
  shop: make("shop", "Cozy shelter"),
};

export function getWorld(key: WorldKey): WorldSource {
  return WORLDS[key];
}
