import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Command } from "~/types/command.js";
import { fetchPropertySet } from "~/utils/api.js";
import {
  effectiveCommandConfig,
  flushCommandConfig,
  rateLimitFor,
} from "~/utils/command-config.js";

vi.mock("~/utils/api.js", () => ({
  fetchPropertySet: vi.fn(),
}));

function command(overrides: Partial<Command> = {}): Command {
  return {
    name: "test",
    messageExecute: async () => true,
    ...overrides,
  };
}

describe("effectiveCommandConfig", () => {
  beforeEach(() => {
    vi.mocked(fetchPropertySet).mockReset();
    flushCommandConfig();
  });

  it("lets the propertyset override a code default", async () => {
    vi.mocked(fetchPropertySet).mockResolvedValue({
      success: true,
      data: { gaiaQueries: { propertySet: { permission: "bot.override" } } },
    });
    const config = await effectiveCommandConfig(
      command({ permission: "bot.default" })
    );
    expect(config.permission).toBe("bot.override");
  });

  it("lets a null propertyset value clear a code default", async () => {
    vi.mocked(fetchPropertySet).mockResolvedValue({
      success: true,
      data: { gaiaQueries: { propertySet: { permission: null } } },
    });
    const config = await effectiveCommandConfig(
      command({ permission: "bot.default" })
    );
    expect(config.permission).toBeNull();
  });

  it("falls back to the code default when the entry has no value", async () => {
    vi.mocked(fetchPropertySet).mockResolvedValue({
      success: true,
      data: { gaiaQueries: { propertySet: { command: "test" } } },
    });
    const config = await effectiveCommandConfig(
      command({ rateLimit: { capacity: 1, refillPerSecond: 0.1 } })
    );
    expect(config.rateLimit).toEqual({ capacity: 1, refillPerSecond: 0.1 });
  });

  it("falls back to nothing when the entry is missing", async () => {
    vi.mocked(fetchPropertySet).mockResolvedValue({
      success: true,
      data: { gaiaQueries: { propertySet: null } },
    });
    const config = await effectiveCommandConfig(command());
    expect(config.permission).toBeUndefined();
    expect(config.rateLimit).toBeUndefined();
  });

  it("merges propertyset channels over code channels", async () => {
    vi.mocked(fetchPropertySet).mockResolvedValue({
      success: true,
      data: {
        gaiaQueries: {
          propertySet: {
            rateLimit: {
              capacity: 5,
              refillPerSecond: 0.1,
              channels: { "999": { capacity: 1, refillPerSecond: 0.5 } },
            },
          },
        },
      },
    });
    const config = await effectiveCommandConfig(
      command({
        rateLimit: {
          capacity: 1,
          refillPerSecond: 0.0167,
          channels: { "888": { capacity: 1, refillPerSecond: 0.1 } },
        },
      })
    );
    expect(config.rateLimit?.capacity).toBe(5);
    expect(config.rateLimit?.channels?.["888"]).toEqual({ capacity: 1, refillPerSecond: 0.1 });
    expect(config.rateLimit?.channels?.["999"]).toEqual({ capacity: 1, refillPerSecond: 0.5 });
  });

  it("refetches after the cache is flushed", async () => {
    vi.mocked(fetchPropertySet).mockResolvedValue({
      success: true,
      data: { gaiaQueries: { propertySet: { permission: "bot.old" } } },
    });
    await effectiveCommandConfig(command());
    flushCommandConfig();
    vi.mocked(fetchPropertySet).mockResolvedValue({
      success: true,
      data: { gaiaQueries: { propertySet: { permission: "bot.new" } } },
    });
    const config = await effectiveCommandConfig(command());
    expect(config.permission).toBe("bot.new");
  });
});

describe("rateLimitFor", () => {
  const globalRate = { capacity: 1, refillPerSecond: 0.0167 };
  const override = { capacity: 1, refillPerSecond: 0.1 };

  it("uses a channel override when present", () => {
    expect(
      rateLimitFor({ rateLimit: { ...globalRate, channels: { ch1: override } } }, "ch1")
    ).toEqual(override);
  });

  it("falls back to the global when no override exists", () => {
    const config = { rateLimit: { ...globalRate, channels: { ch1: override } } };
    expect(rateLimitFor(config, "ch99")).toEqual(config.rateLimit);
  });

  it("falls back to the global when no channel id is provided", () => {
    const config = { rateLimit: { ...globalRate, channels: { ch1: override } } };
    expect(rateLimitFor(config, undefined)).toEqual(config.rateLimit);
  });

  it("returns undefined when rate limits are cleared", () => {
    expect(rateLimitFor({ permission: "x", rateLimit: null }, "ch1")).toBeUndefined();
  });
});
