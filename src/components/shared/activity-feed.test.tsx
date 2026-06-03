import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ActivityFeed } from "@/components/shared/activity-feed";
import { PEOPLE, type Activity } from "@/lib/data";

const items: Activity[] = [
  { id: "a1", who: PEOPLE.devon, type: "donate", amount: 250, msg: "Stay safe", at: "now", target: "alerts" },
  { id: "a2", who: PEOPLE.sofia, type: "follow", at: "5m", target: "alerts" },
];

describe("ActivityFeed", () => {
  it("renders donation amount and follow verb", () => {
    render(<ActivityFeed items={items} />);
    expect(screen.getByText("$250")).toBeInTheDocument();
    expect(screen.getByText(/started keeping watch/)).toBeInTheDocument();
  });

  it("calls onItem when a row is clicked", async () => {
    const onItem = vi.fn();
    render(<ActivityFeed items={items} onItem={onItem} />);
    await userEvent.click(screen.getByText("Devon"));
    expect(onItem).toHaveBeenCalledWith(items[0]);
  });
});
