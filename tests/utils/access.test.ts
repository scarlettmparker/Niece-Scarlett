import { describe, expect, it } from "vitest";
import { checkRateLimit, matchPermission } from "~/utils/access.js";

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

describe("checkRateLimit", () => {
  it("allows the bucket's capacity up front", () => {
    const first = checkRateLimit("user:cmd", 2, 1);
    const second = checkRateLimit("user:cmd", 2, 1);
    const third = checkRateLimit("user:cmd", 2, 1);
    expect(first.allowed).toBe(true);
    expect(second.allowed).toBe(true);
    expect(third.allowed).toBe(false);
    expect(third.retryAfter).toBeGreaterThan(0);
  });

  it("refills tokens over time", () => {
    checkRateLimit("user2:cmd", 1, 1);
    expect(checkRateLimit("user2:cmd", 1, 1).allowed).toBe(false);
  });
});
