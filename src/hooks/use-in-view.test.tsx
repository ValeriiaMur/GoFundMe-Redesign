import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { useInView } from "@/hooks/use-in-view";

type IOCallback = (entries: Array<{ isIntersecting: boolean }>) => void;

let lastCallback: IOCallback | null = null;
const observe = vi.fn();
const disconnect = vi.fn();

class MockIO {
  constructor(cb: IOCallback) {
    lastCallback = cb;
  }
  observe = observe;
  disconnect = disconnect;
  unobserve = vi.fn();
  takeRecords = vi.fn();
}

describe("useInView", () => {
  beforeEach(() => {
    lastCallback = null;
    observe.mockClear();
    disconnect.mockClear();
    vi.stubGlobal("IntersectionObserver", MockIO as unknown as typeof IntersectionObserver);
  });
  afterEach(() => vi.unstubAllGlobals());

  it("starts out of view and observes the target", () => {
    const { result } = renderHook(() => useInView<HTMLDivElement>());
    // Attach the ref to a node so the observer can start.
    const node = document.createElement("div");
    act(() => result.current[0](node));
    expect(result.current[1]).toBe(false);
    expect(observe).toHaveBeenCalledWith(node);
  });

  it("flips to in-view and disconnects once intersecting", () => {
    const { result } = renderHook(() => useInView<HTMLDivElement>());
    act(() => result.current[0](document.createElement("div")));
    act(() => lastCallback?.([{ isIntersecting: true }]));
    expect(result.current[1]).toBe(true);
    expect(disconnect).toHaveBeenCalled();
  });
});
