"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const pagination_1 = require("../../src/components/pagination");
(0, vitest_1.describe)("chunkText", () => {
    (0, vitest_1.it)("keeps short content as a single page", () => {
        (0, vitest_1.expect)((0, pagination_1.chunkText)("short text")).toEqual(["short text"]);
    });
    (0, vitest_1.it)("returns no pages for empty content", () => {
        (0, vitest_1.expect)((0, pagination_1.chunkText)("")).toEqual([]);
    });
    (0, vitest_1.it)("breaks long content at the last newline that fits", () => {
        const paragraph = "word ".repeat(100).trim();
        const content = `${paragraph}\n${paragraph}`;
        const pages = (0, pagination_1.chunkText)(content, 100);
        (0, vitest_1.expect)(pages.length).toBeGreaterThan(1);
        for (const page of pages) {
            (0, vitest_1.expect)(page.length).toBeLessThanOrEqual(pagination_1.MAX_PAGE_LENGTH);
        }
    });
    (0, vitest_1.it)("hard-cuts when a single line exceeds the limit", () => {
        const content = "x".repeat(5000);
        const pages = (0, pagination_1.chunkText)(content, 1000);
        (0, vitest_1.expect)(pages.length).toBe(5);
        pages.forEach((page) => (0, vitest_1.expect)(page.length).toBe(1000));
    });
    (0, vitest_1.it)("joins back to the original content", () => {
        const content = Array.from({ length: 20 }, (_, index) => `line ${index}`).join("\n");
        const pages = (0, pagination_1.chunkText)(content, 40);
        (0, vitest_1.expect)(pages.join("\n")).toBe(content);
    });
});
