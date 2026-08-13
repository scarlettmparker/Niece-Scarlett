import { describe, expect, it } from "vitest";
import { parseViewerToken } from "~/components/text-viewer.js";
import { parseListToken } from "~/components/text-list.js";

describe("parseViewerToken", () => {
  it("parses a viewer button custom id", () => {
    expect(parseViewerToken("ns:text:abc123:next")).toEqual({
      token: "abc123",
      direction: "next",
    });
  });

  it("parses a prev button custom id", () => {
    expect(parseViewerToken("ns:text:abc123:prev")).toEqual({
      token: "abc123",
      direction: "prev",
    });
  });

  it("rejects unknown prefixes", () => {
    expect(parseViewerToken("ns:list:abc123:next")).toBeNull();
  });

  it("rejects unknown directions", () => {
    expect(parseViewerToken("ns:text:abc123:jump")).toBeNull();
  });
});

describe("parseListToken", () => {
  it("parses a list page-button custom id", () => {
    expect(parseListToken("ns:list:abc123:next")).toEqual({
      token: "abc123",
      direction: "next",
    });
  });

  it("rejects unknown prefixes", () => {
    expect(parseListToken("ns:text:abc123:next")).toBeNull();
  });
});
