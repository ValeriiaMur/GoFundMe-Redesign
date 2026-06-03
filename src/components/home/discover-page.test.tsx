import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const site = {
  raisedFor: vi.fn((id: string) => ({ alerts: 184200, shelter: 41850, replant: 97300 })[id] ?? 0),
  goCommunities: vi.fn(),
  goCommunity: vi.fn(),
  goCause: vi.fn(),
};

vi.mock("@/components/app/site-provider", () => ({
  useSite: () => site,
}));

import { DiscoverPage } from "@/components/home/discover-page";

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
  vi.clearAllMocks();
});

describe("DiscoverPage", () => {
  it("keeps the cinematic arrival hero with a de-chipped live label", () => {
    render(<DiscoverPage />);
    expect(
      screen.getByRole("heading", { name: "Every cause is a place. Find yours." }),
    ).toBeInTheDocument();
    expect(screen.getByText("Help finds a way").closest(".live-label")).not.toBeNull();
  });

  it("features the community as an immersive doorway card that enters it", async () => {
    render(<DiscoverPage />);
    await userEvent.click(screen.getByRole("button", { name: /Enter Wildfire Watch/ }));
    expect(site.goCommunity).toHaveBeenCalledWith("wildfire-watch");
  });

  it("lists fundraisers as front rows that travel into the cause", async () => {
    render(<DiscoverPage />);
    await userEvent.click(screen.getByText("Real-time wildfire alerts"));
    expect(site.goCause).toHaveBeenCalledWith("alerts");
  });
});
