import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { DoorwayTile } from "@/components/communities/doorway-tile";
import { COMMUNITIES } from "@/lib/data";

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
}

beforeEach(mockMatchMedia);
afterEach(() => vi.unstubAllGlobals());

const community = COMMUNITIES.watch;

describe("DoorwayTile", () => {
  it("renders pulse, name, tagline and a mono meta line", () => {
    const { container } = render(
      <DoorwayTile
        community={community}
        raised={323350}
        active={false}
        onPreview={() => {}}
        onEnter={() => {}}
      />,
    );
    expect(screen.getByText("Wildfire Watch")).toBeInTheDocument();
    expect(screen.getByText(community.tagline)).toBeInTheDocument();
    const meta = container.querySelector(".idx-card-meta");
    expect(meta).toHaveTextContent("12,480 members");
    expect(meta).toHaveTextContent("3 causes");
    expect(meta).toHaveTextContent("$323,350");
    // the watch community's pulse is empty — no orphaned live label
    expect(container.querySelector(".idx-pulse-mini")).toBeNull();
  });

  it("previews on hover and on focus", () => {
    const onPreview = vi.fn();
    render(
      <DoorwayTile
        community={community}
        raised={0}
        active={false}
        onPreview={onPreview}
        onEnter={() => {}}
      />,
    );
    fireEvent.mouseEnter(screen.getByRole("button"));
    fireEvent.focus(screen.getByRole("button"));
    expect(onPreview).toHaveBeenCalledTimes(2);
  });

  it("activating an already-previewed tile enters; otherwise it previews first", async () => {
    const onPreview = vi.fn();
    const onEnter = vi.fn();
    const { rerender } = render(
      <DoorwayTile
        community={community}
        raised={0}
        active={false}
        onPreview={onPreview}
        onEnter={onEnter}
      />,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onEnter).not.toHaveBeenCalled();
    expect(onPreview).toHaveBeenCalled();

    rerender(
      <DoorwayTile
        community={community}
        raised={0}
        active
        onPreview={onPreview}
        onEnter={onEnter}
      />,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onEnter).toHaveBeenCalledOnce();
  });
});
