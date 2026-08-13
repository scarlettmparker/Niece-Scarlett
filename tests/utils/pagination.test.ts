import { describe, expect, it } from "vitest";
import { chunkText, MAX_PAGE_LENGTH, pageSlice } from "~/utils/pagination.js";

describe("chunkText", () => {
  it("keeps short content as a single page", () => {
    expect(chunkText("short text")).toEqual(["short text"]);
  });

  it("returns no pages for empty content", () => {
    expect(chunkText("")).toEqual([]);
  });

  it("breaks long content at the last newline that fits", () => {
    const paragraph = "word ".repeat(100).trim();
    const content = `${paragraph}\n${paragraph}`;

    const pages = chunkText(content, 100);

    expect(pages.length).toBeGreaterThan(1);
    for (const page of pages) {
      expect(page.length).toBeLessThanOrEqual(MAX_PAGE_LENGTH);
    }
  });

  it("hard-cuts when a single line exceeds the limit", () => {
    const content = "x".repeat(5000);

    const pages = chunkText(content, 1000);

    expect(pages.length).toBe(5);
    pages.forEach((page) => expect(page.length).toBe(1000));
  });

  it("joins back to the original content", () => {
    const content = Array.from({ length: 20 }, (_, index) => `line ${index}`).join("\n");

    const pages = chunkText(content, 40);

    expect(pages.join("\n")).toBe(content);
  });
});

describe("pageSlice", () => {
  it("slices the requested page", () => {
    const result = pageSlice([1, 2, 3, 4, 5], 0, 2);

    expect(result.items).toEqual([1, 2]);
    expect(result.totalPages).toBe(3);
    expect(result.hasNext).toBe(true);
    expect(result.hasPrevious).toBe(false);
  });

  it("reports the last page", () => {
    const result = pageSlice([1, 2, 3, 4, 5], 2, 2);

    expect(result.items).toEqual([5]);
    expect(result.hasNext).toBe(false);
    expect(result.hasPrevious).toBe(true);
  });

  it("clamps empty lists to a single page", () => {
    const result = pageSlice([], 0, 10);

    expect(result.items).toEqual([]);
    expect(result.totalPages).toBe(1);
  });
});
