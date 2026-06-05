import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

const site = {
  raisedFor: vi.fn(() => 100000),
  lanternsFor: vi.fn(() => 1201),
  openDonate: vi.fn(),
  openLantern: vi.fn(),
  goCommunities: vi.fn(),
  goCause: vi.fn(),
};
vi.mock("@/components/app/site-provider", () => ({ useSite: () => site }));

let reduced = false;
vi.mock("@/hooks/use-prefers-reduced-motion", () => ({
  usePrefersReducedMotion: () => reduced,
}));

import { LanternHero } from "@/components/home/lantern-hero";

beforeEach(() => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe = vi.fn();
      disconnect = vi.fn();
      unobserve = vi.fn();
    } as unknown as typeof ResizeObserver,
  );
});

afterEach(() => {
  reduced = false;
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe("LanternHero", () => {
  it("renders the pinned canvas hero with the three beats", () => {
    const { container } = render(<LanternHero />);
    expect(container.querySelector("canvas.lhero-canvas")).not.toBeNull();
    expect(
      screen.getByRole("heading", { name: "Start fundraising on GoFundMe" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Help finds a way.")).toBeInTheDocument();
    expect(screen.getByText(/and let it lift/)).toBeInTheDocument();
    expect(screen.getByText("light.")).toBeInTheDocument();
    expect(container.querySelectorAll(".lhero-bubble")).toHaveLength(3);
  });

  it("shows the featured community rail and the scroll cue", () => {
    render(<LanternHero />);
    expect(screen.getByText("Featured community")).toBeInTheDocument();
    expect(screen.getByText("Wildfire Watch")).toBeInTheDocument();
    expect(screen.getByText("Scroll to release")).toBeInTheDocument();
  });

  it("shows the dawn preloader until the frame sequence is ready", () => {
    render(<LanternHero />);
    // jsdom never fires image load events, so the preloader stays visible
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(screen.getByText("0%")).toBeInTheDocument();
  });

  it("beat-1 CTA is 'Start a GoFundMe' and opens the not-built modal", () => {
    render(<LanternHero />);
    fireEvent.click(screen.getByRole("button", { name: "Start a GoFundMe" }));
    expect(screen.getByText(/isn’t lit yet/i)).toBeInTheDocument();
    expect(site.openDonate).not.toHaveBeenCalled();
  });

  it("beat-2 'Light a lantern' opens the donate flow for the community's lead cause", () => {
    render(<LanternHero />);
    // beat 2 is aria-hidden until the scroll choreography reveals it
    fireEvent.click(screen.getByRole("button", { name: "Light a lantern", hidden: true }));
    expect(site.openDonate).toHaveBeenCalledWith("alerts");
  });

  it("drifts card-style gold sparks (WorldGrow) over the hero in both modes", () => {
    const { container } = render(<LanternHero />);
    expect(container.querySelector(".lhero-pin .world-grow")).not.toBeNull();
    expect(container.querySelectorAll(".world-grow .lantern").length).toBeGreaterThan(0);

    reduced = true;
    const { container: staticC } = render(<LanternHero />);
    expect(staticC.querySelector(".lhero-pin .world-grow")).not.toBeNull();
  });

  it("falls back to the static held-and-glowing pose under reduced motion", () => {
    reduced = true;
    const { container } = render(<LanternHero />);
    expect(container.querySelector("canvas")).toBeNull();
    expect(screen.getByAltText(/lantern/i)).toHaveAttribute("src", "/hero/lantern/frame-002.webp");
    expect(screen.queryByRole("progressbar")).toBeNull();
    // only beat 1 renders in static mode
    expect(screen.queryByText(/and let it lift/)).toBeNull();
  });
});
