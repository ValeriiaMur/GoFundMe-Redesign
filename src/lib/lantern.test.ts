import { describe, it, expect } from "vitest";

import {
  LANTERN_FRAME_COUNT,
  frameBlendAt,
  heroOverlayAt,
  lanternFrameSrc,
  staticFrameSrc,
} from "@/lib/lantern";

describe("lanternFrameSrc", () => {
  it("maps frame indices to zero-padded public paths", () => {
    expect(lanternFrameSrc(0)).toBe("/hero/lantern/frame-001.webp");
    expect(lanternFrameSrc(7)).toBe("/hero/lantern/frame-008.webp");
  });

  it("uses the held-and-glowing pose for the static hero", () => {
    expect(staticFrameSrc()).toBe("/hero/lantern/frame-002.webp");
  });
});

describe("frameBlendAt", () => {
  it("starts on the first frame with no blend", () => {
    expect(frameBlendAt(0)).toEqual({ from: 0, to: 1, mix: 0 });
  });

  it("ends settled on the last frame", () => {
    const end = frameBlendAt(1);
    expect(end.from).toBe(LANTERN_FRAME_COUNT - 1);
    expect(end.mix).toBe(0);
  });

  it("crossfades between adjacent frames mid-scroll with smoothstep easing", () => {
    // progress 0.5 across 8 frames → position 3.5: halfway between frames 3 and 4
    expect(frameBlendAt(0.5)).toEqual({ from: 3, to: 4, mix: 0.5 });
  });

  it("clamps out-of-range progress", () => {
    expect(frameBlendAt(-1)).toEqual(frameBlendAt(0));
    expect(frameBlendAt(2)).toEqual(frameBlendAt(1));
  });
});

describe("heroOverlayAt", () => {
  it("opens on beat 1 with the rail and cue fully visible", () => {
    const o = heroOverlayAt(0);
    expect(o.beat1).toBe(1);
    expect(o.beat2).toBe(0);
    expect(o.beat3).toBe(0);
    expect(o.rail).toBe(1);
    expect(o.cue).toBe(1);
    expect(o.activeBeat).toBe(0);
  });

  it("crossfades to the release beat mid-scroll", () => {
    const o = heroOverlayAt(0.55);
    expect(o.beat1).toBe(0);
    expect(o.beat2).toBe(1);
    expect(o.beat3).toBe(0);
    expect(o.activeBeat).toBe(1);
  });

  it("ends on 'follow the light' with rail and cue gone", () => {
    const o = heroOverlayAt(1);
    expect(o.beat3).toBe(1);
    expect(o.beat2).toBe(0);
    expect(o.rail).toBe(0);
    expect(o.cue).toBe(0);
    expect(o.activeBeat).toBe(2);
  });
});
