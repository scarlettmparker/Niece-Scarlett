import { beforeEach, describe, expect, it, vi } from "vitest";
import { executeDocument } from "@sun/api";
import "../../src/data/language-transfer-data.js";
import { resolvePageData } from "~/utils/page-data.js";
vi.mock("@sun/api", () => ({
    executeDocument: vi.fn(),
}));
describe("language-transfer loader", () => {
    beforeEach(() => {
        vi.mocked(executeDocument).mockReset();
    });
    it("returns the faq for a language", async () => {
        vi.mocked(executeDocument).mockResolvedValue({
            success: true,
            data: { gaiaQueries: { propertySet: { title: "What is Language Transfer?" } } },
        });
        const data = await resolvePageData("faq", "language-transfer", {
            language: "en",
        });
        expect(data.title).toBe("What is Language Transfer?");
    });
    it("returns an empty faq when the entry is missing", async () => {
        vi.mocked(executeDocument).mockResolvedValue({
            success: false,
            error: "boom",
            statusCode: 400,
        });
        const data = await resolvePageData("faq", "language-transfer", {
            language: "el",
        });
        expect(data.title).toBeUndefined();
    });
});
