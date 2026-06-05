import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const site = {
  raisedFor: vi.fn((id: string) => ({ alerts: 184200, shelter: 41850, replant: 97300 })[id] ?? 0),
  lanternsFor: vi.fn(() => 1201),
  openDonate: vi.fn(),
  openLantern: vi.fn(),
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
}

beforeEach(mockEnvironment);
afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe("DiscoverPage", () => {
  it("opens with the scroll-scrubbed lantern hero", () => {
    const { container } = render(<DiscoverPage />);
    expect(container.querySelector(".lhero-wrap canvas")).not.toBeNull();
    expect(
      screen.getByRole("heading", { name: "Start fundraising on GoFundMe" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Help finds a way.", { selector: ".lhero-tag" })).toBeInTheDocument();
  });

  it("shows the Raise → Share → Receive value props", () => {
    render(<DiscoverPage />);
    expect(screen.getByText("Raise")).toBeInTheDocument();
    expect(screen.getByText("Share")).toBeInTheDocument();
    expect(screen.getByText("Receive")).toBeInTheDocument();
  });

  it("the atlas watch tile enters the community", async () => {
    render(<DiscoverPage />);
    await userEvent.click(screen.getByRole("button", { name: /Enter the watch/ }));
    expect(site.goCommunity).toHaveBeenCalledWith("wildfire-watch");
  });

  it("atlas cause tiles travel into the fundraiser", async () => {
    render(<DiscoverPage />);
    await userEvent.click(screen.getByRole("button", { name: /Real-time wildfire alerts/ }));
    expect(site.goCause).toHaveBeenCalledWith("alerts");
  });

  it("the lantern tile lights a lantern locally", async () => {
    render(<DiscoverPage />);
    const count = screen.getByText("1,201", { selector: ".tile-lan-count" });
    await userEvent.click(count.closest("button")!);
    expect(screen.getByText("1,202", { selector: ".tile-lan-count" })).toBeInTheDocument();
  });
});
