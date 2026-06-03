import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { WatchRoom } from "@/components/community/watch-room";
import { ACTIVITY, COMMUNITIES, FUNDRAISERS } from "@/lib/data";
import { causesOf } from "@/lib/structure";
import { setAnalyticsSink, type CapturePayload } from "@/lib/analytics";

function mockMatchMedia() {
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

beforeEach(mockMatchMedia);
afterEach(() => {
  vi.unstubAllGlobals();
  setAnalyticsSink(null);
});

const community = COMMUNITIES.watch;

function renderRoom(overrides?: { onDonate?: (id: string) => void }) {
  return render(
    <WatchRoom
      community={community}
      causes={causesOf(community)}
      raisedFor={(id) => FUNDRAISERS[id]?.raised ?? 0}
      feed={ACTIVITY}
      followedById={{}}
      onDonate={overrides?.onDonate ?? (() => {})}
      onLantern={() => {}}
      onFollow={() => {}}
    />,
  );
}

describe("WatchRoom", () => {
  it("selects the first fundraiser by default and shows it in the detail panel", () => {
    renderRoom();
    expect(
      screen.getByRole("heading", { name: "Real-time alerts for wildfire safety" }),
    ).toBeInTheDocument();
  });

  it("swaps the detail panel in place when another front is picked", async () => {
    renderRoom();
    await userEvent.click(screen.getByText("Shelter the animals"));
    expect(
      screen.getByRole("heading", { name: "Evacuate & shelter the animals" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Real-time alerts for wildfire safety" }),
    ).not.toBeInTheDocument();
  });

  it("plants a light on the selected front", async () => {
    const onDonate = vi.fn();
    renderRoom({ onDonate });
    await userEvent.click(screen.getByText("Shelter the animals"));
    await userEvent.click(screen.getByRole("button", { name: "Plant a light" }));
    expect(onDonate).toHaveBeenCalledWith("shelter");
  });

  it("tracks select_front when a front is picked", async () => {
    const seen: CapturePayload[] = [];
    setAnalyticsSink((p) => seen.push(p));
    renderRoom();
    await userEvent.click(screen.getByText("Shelter the animals"));
    expect(seen).toContainEqual({
      event: "select_front",
      properties: { causeId: "shelter", communityId: "watch" },
    });
  });

  it("filters the live feed to the selected front and the community", () => {
    renderRoom();
    // a6 targets replant — not visible while alerts is selected
    expect(screen.queryByText(/A tree for the creek/)).not.toBeInTheDocument();
  });
});
