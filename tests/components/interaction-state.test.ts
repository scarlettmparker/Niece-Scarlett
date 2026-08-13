import { afterEach, describe, expect, it, vi } from "vitest";
import {
  deleteState,
  getState,
  setState,
  updateState,
} from "~/components/interaction-state.js";

afterEach(() => {
  vi.useRealTimers();
});

describe("interaction state", () => {
  it("returns what was stored", () => {
    const token = setState({ page: 1 });

    expect(getState<{ page: number }>(token)).toEqual({ page: 1 });
  });

  it("returns undefined for an unknown token", () => {
    expect(getState("nope")).toBeUndefined();
  });

  it("merges patches into stored state", () => {
    const token = setState({ page: 0, total: 5 });

    updateState(token, { page: 2 });

    expect(getState(token)).toEqual({ page: 2, total: 5 });
  });

  it("does nothing when patching an unknown token", () => {
    expect(() => updateState("nope", { page: 1 })).not.toThrow();
  });

  it("removes stored state on delete", () => {
    const token = setState({ page: 1 });

    deleteState(token);

    expect(getState(token)).toBeUndefined();
  });

  it("expires state after the TTL", () => {
    vi.useFakeTimers();
    const token = setState({ page: 1 });

    vi.advanceTimersByTime(15 * 60 * 1000 + 1);

    expect(getState(token)).toBeUndefined();
  });
});
