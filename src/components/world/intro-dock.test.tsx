import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createRef } from "react";
import { render, act, fireEvent } from "@testing-library/react";

import { IntroDock } from "@/components/world/intro-dock";
import type { WorldSource } from "@/lib/worlds";

const world: WorldSource = {
  name: "Test world",
  webm: "/worlds/test.webm",
  mp4: "/worlds/test.mp4",
  poster: "/worlds/test.jpg",
};

beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  );
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe = vi.fn();
      disconnect = vi.fn();
      unobserve = vi.fn();
    } as unknown as typeof ResizeObserver,
  );
  Object.defineProperty(HTMLMediaElement.prototype, "play", {
    configurable: true,
    value: vi.fn().mockResolvedValue(undefined),
  });
});
afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

function setup(introStyle: "cinematic" | "instant" | "scroll") {
  const slotRef = createRef<HTMLDivElement>();
  const utils = render(
    <>
      <div ref={slotRef} data-testid="slot" />
      <IntroDock
        world={world}
        kicker="GOFUNDME"
        headline="Reach out."
        introStyle={introStyle}
        slotRef={slotRef}
      />
    </>,
  );
  return { ...utils, slotRef };
}

describe("IntroDock", () => {
  it("starts full-screen in cinematic mode then docks after the intro", () => {
    const { getByRole } = setup("cinematic");
    const dock = getByRole("button");
    expect(dock).toHaveAttribute("data-phase", "full");
    act(() => vi.advanceTimersByTime(2800));
    expect(dock).toHaveAttribute("data-phase", "docked");
  });

  it("starts docked in instant mode", () => {
    const { getByRole } = setup("instant");
    expect(getByRole("button")).toHaveAttribute("data-phase", "docked");
  });

  it("re-expands to full when the docked emblem is clicked", () => {
    const { getByRole } = setup("instant");
    const dock = getByRole("button");
    expect(dock).toHaveAttribute("data-phase", "docked");
    fireEvent.click(dock);
    expect(dock).toHaveAttribute("data-phase", "full");
  });
});
