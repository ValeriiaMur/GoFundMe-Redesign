import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";

import { WorldCard } from "@/components/world/world-card";
import type { WorldSource } from "@/lib/worlds";

const world: WorldSource = {
  name: "Test world",
  webm: "/worlds/test.webm",
  mp4: "/worlds/test.mp4",
  poster: "/worlds/test.jpg",
};

beforeEach(() => {
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe = vi.fn();
      disconnect = vi.fn();
      unobserve = vi.fn();
      takeRecords = vi.fn();
    } as unknown as typeof IntersectionObserver,
  );
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  );
});
afterEach(() => vi.unstubAllGlobals());

describe("WorldCard", () => {
  it("renders the title and blurb with a lazy world poster", () => {
    const { container } = render(
      <WorldCard world={world} title="The Signal" blurb="A signal in the dark." />,
    );
    expect(screen.getByText("The Signal")).toBeInTheDocument();
    expect(screen.getByText("A signal in the dark.")).toBeInTheDocument();
    // Lazy: before intersecting, only the poster image is present (no video download).
    expect(container.querySelector("video")).toBeNull();
    expect(container.querySelector("img")).toHaveAttribute("src", "/worlds/test.jpg");
  });
});
