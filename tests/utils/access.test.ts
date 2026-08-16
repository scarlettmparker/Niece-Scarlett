import { describe, expect, it } from "vitest";
import {
  matchPermission,
  refundRateLimit,
  reserveRateLimit,
} from "~/utils/access.js";

describe("matchPermission", () => {
  it("matches an exact permission", () => {
    expect(
      matchPermission("bot.commands.classify", "bot.commands.classify"),
    ).toBe(true);
  });

  it("matches a wildcard pattern", () => {
    expect(matchPermission("bot.commands.pronounce", "bot.*")).toBe(true);
    expect(matchPermission("bot.commands.classify", "*")).toBe(true);
  });

  it("matches a mid-path wildcard", () => {
    expect(matchPermission("bot.commands.classify", "bot.*.classify")).toBe(
      true,
    );
  });

  it("rejects a non-matching permission", () => {
    expect(
      matchPermission("bot.commands.pronounce", "bot.commands.classify"),
    ).toBe(false);
    expect(matchPermission("bot.commands.pronounce", "bot.commands")).toBe(
      false,
    );
    expect(matchPermission("other.thing", "bot.*")).toBe(false);
  });

  it("treats dots literally, not as regex wildcards", () => {
    expect(matchPermission("botXcommands.classify", "bot.commands.*")).toBe(
      false,
    );
  });
});

describe("reserveRateLimit", () => {
  it("allows one attempt per refill window", () => {
    expect(reserveRateLimit("user:cmd", 1, 0.1).allowed).toBe(true);
    const denied = reserveRateLimit("user:cmd", 1, 0.1);
    expect(denied.allowed).toBe(false);
    expect(denied.retryAfter).toBeGreaterThan(0);
  });

  it("refunds a token so a failed attempt does not count", () => {
    reserveRateLimit("user2:cmd", 1, 0.1);
    refundRateLimit("user2:cmd", 1, 0.1);
    expect(reserveRateLimit("user2:cmd", 1, 0.1).allowed).toBe(true);
  });

  it("denies a key with capacity zero", () => {
    expect(reserveRateLimit("user4:cmd", 0, 1).allowed).toBe(false);
    expect(reserveRateLimit("user4:cmd", 0, 1).retryAfter).toBeGreaterThan(0);
    expect(reserveRateLimit("user5:cmd", 1, 1).allowed).toBe(true);
  });

  it("replaces the bucket when the config changes", () => {
    reserveRateLimit("user3:cmd", 1, 0.1);
    expect(reserveRateLimit("user3:cmd", 1, 0.1).allowed).toBe(false);
    expect(reserveRateLimit("user3:cmd", 2, 0.1).allowed).toBe(true);
    expect(reserveRateLimit("user3:cmd", 2, 0.1).allowed).toBe(true);
  });
});
