import { describe, expect, it } from "vitest";
import { classifyTarget } from "~/commands/classify.js";

describe("classifyTarget", () => {
  it("prefers inline arguments over a reply", () => {
    expect(classifyTarget(["some", "text"], false)).toBe("inline");
    expect(classifyTarget(["some", "text"], true)).toBe("inline");
  });

  it("classifies a replied message when there are no arguments", () => {
    expect(classifyTarget([], true)).toBe("reply");
  });

  it("returns null without arguments or a reply", () => {
    expect(classifyTarget([], false)).toBeNull();
  });
});
