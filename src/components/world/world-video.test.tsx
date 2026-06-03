import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, act } from "@testing-library/react";

import { WorldVideo } from "@/components/world/world-video";
import type { WorldSource } from "@/lib/worlds";

const world: WorldSource = {
  name: "Test world",
  webm: "/worlds/test.webm",
  mp4: "/worlds/test.mp4",
  poster: "/worlds/test.jpg",
};

type IOCallback = (entries: Array<{ isIntersecting: boolean }>) => void;
let ioCallback: IOCallback | null = null;

class MockIO {
  constructor(cb: IOCallback) {
    ioCallback = cb;
  }
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
  takeRecords = vi.fn();
}

function mockMatchMedia(reduced: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockReturnValue({
      matches: reduced,
      media: "(prefers-reduced-motion: reduce)",
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  );
}

beforeEach(() => {
  ioCallback = null;
  vi.stubGlobal("IntersectionObserver", MockIO as unknown as typeof IntersectionObserver);
  // jsdom doesn't implement play()
  Object.defineProperty(HTMLMediaElement.prototype, "play", {
    configurable: true,
    value: vi.fn().mockResolvedValue(undefined),
  });
});
afterEach(() => vi.unstubAllGlobals());

describe("WorldVideo", () => {
  it("renders webm then mp4 sources, with poster and background-friendly attributes", () => {
    mockMatchMedia(false);
    const { container } = render(<WorldVideo world={world} priority />);
    const video = container.querySelector("video");
    expect(video).not.toBeNull();
    expect(video).toHaveAttribute("poster", "/worlds/test.jpg");
    expect(video).toHaveAttribute("playsinline");
    expect(video).toHaveAttribute("loop");
    expect(video!.muted).toBe(true);

    const sources = container.querySelectorAll("source");
    expect(sources).toHaveLength(2);
    expect(sources[0]).toHaveAttribute("src", "/worlds/test.webm");
    expect(sources[0]).toHaveAttribute("type", "video/webm");
    expect(sources[1]).toHaveAttribute("src", "/worlds/test.mp4");
    expect(sources[1]).toHaveAttribute("type", "video/mp4");
  });

  it("shows only the poster image (no video) when motion is reduced", () => {
    mockMatchMedia(true);
    const { container } = render(<WorldVideo world={world} priority />);
    expect(container.querySelector("video")).toBeNull();
    const img = container.querySelector("img");
    expect(img).toHaveAttribute("src", "/worlds/test.jpg");
  });

  it("renders the poster only (sparks still ride on top) when still", () => {
    mockMatchMedia(false);
    const { container } = render(<WorldVideo world={world} still />);
    expect(container.querySelector("video")).toBeNull();
    expect(container.querySelector("img")).toHaveAttribute("src", "/worlds/test.jpg");
  });

  it("defers the video until scrolled into view when lazy", () => {
    mockMatchMedia(false);
    const { container } = render(<WorldVideo world={world} lazy />);
    // Before intersection: poster only, no video download.
    expect(container.querySelector("video")).toBeNull();
    expect(container.querySelector("img")).not.toBeNull();
    // Simulate the element entering the viewport.
    act(() => ioCallback?.([{ isIntersecting: true }]));
    expect(container.querySelector("video")).not.toBeNull();
  });
});
