import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Doorway } from "@/components/communities/doorway";
import { COMMUNITIES, PEOPLE, type Community } from "@/lib/data";
import { setAnalyticsSink, type CapturePayload } from "@/lib/analytics";

function mockEnvironment() {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockReturnValue({
      matches: false,
      media: "",
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  );
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe = vi.fn();
      disconnect = vi.fn();
      unobserve = vi.fn();
      takeRecords = vi.fn();
    } as unknown as typeof IntersectionObserver,
  );
  Object.defineProperty(HTMLMediaElement.prototype, "play", {
    configurable: true,
    value: vi.fn().mockResolvedValue(undefined),
  });
}

beforeEach(mockEnvironment);
afterEach(() => {
  vi.unstubAllGlobals();
  setAnalyticsSink(null);
});

const watch = COMMUNITIES.watch;

// A second community used only to exercise the multi-item master-detail.
const tide: Community = {
  id: "tide",
  name: "Tidewater Mutual",
  handle: "tidewater",
  world: "pond",
  accent: 210,
  tagline: "Coastal neighbors holding the line against the floods.",
  about: "Test community.",
  members: 7320,
  raisedAll: 148900,
  lanterns: 540,
  fundraisers: [],
  stewards: [PEOPLE.sofia],
  pulse: "King tide: 2 days out",
};

function renderDoorway(communities: Community[], onEnter = vi.fn()) {
  render(
    <Doorway
      communities={communities}
      raisedOf={(c) => c.raisedAll}
      progressOf={() => 0.5}
      onEnter={onEnter}
    />,
  );
  return onEnter;
}

describe("Doorway", () => {
  it("opens with a plain text intro — no hero video, no live-label chip", () => {
    renderDoorway([watch]);
    expect(
      screen.getByRole("heading", { name: "Find a community to stand with." }),
    ).toBeInTheDocument();
    expect(document.querySelector(".idx-hero")).toBeNull();
    expect(document.querySelector(".idx-intro video, .idx-intro img")).toBeNull();
    expect(screen.queryByText(/Communities · /)).toBeNull();
  });

  it("renders the feature panel full-width with no list for a single community", () => {
    renderDoorway([watch]);
    expect(screen.getByRole("heading", { name: "Wildfire Watch" })).toBeInTheDocument();
    expect(document.querySelector(".idx-list")).toBeNull();
    expect(document.querySelector(".idx-grid")).toHaveClass("solo");
  });

  it("enters the featured community via the Enter button", async () => {
    const onEnter = renderDoorway([watch]);
    await userEvent.click(screen.getByRole("button", { name: /Enter Wildfire Watch/ }));
    expect(onEnter).toHaveBeenCalledWith("wildfire-watch");
  });

  it("previews the first community by default and swaps on hover", () => {
    renderDoorway([watch, tide]);
    expect(screen.getByRole("heading", { name: "Wildfire Watch" })).toBeInTheDocument();
    fireEvent.mouseEnter(screen.getByText("Tidewater Mutual").closest("button")!);
    expect(screen.getByRole("heading", { name: "Tidewater Mutual" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Wildfire Watch" })).not.toBeInTheDocument();
  });

  it("tracks preview_community when the doorway preview changes", () => {
    const seen: CapturePayload[] = [];
    setAnalyticsSink((p) => seen.push(p));
    renderDoorway([watch, tide]);
    fireEvent.mouseEnter(screen.getByText("Tidewater Mutual").closest("button")!);
    expect(seen).toContainEqual({
      event: "preview_community",
      properties: { communityId: "tide" },
    });
  });

  it("counts the gathering communities in the header", () => {
    renderDoorway([watch, tide]);
    expect(screen.getByRole("heading", { name: "2 gathering right now" })).toBeInTheDocument();
  });
});
