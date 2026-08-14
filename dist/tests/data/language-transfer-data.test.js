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
    it("renders inline content", async () => {
        vi.mocked(executeDocument).mockResolvedValue({
            success: true,
            data: {
                gaiaQueries: {
                    propertySet: {
                        kind: "content",
                        content: { title: "What is Language Transfer?", intro: "An audio series" },
                    },
                },
            },
        });
        const faq = await resolvePageData("faq", "language-transfer", {
            language: "en",
        });
        expect(faq.title).toBe("What is Language Transfer?");
        expect(faq.body).toContain("An audio series");
    });
    it("resolves blog-backed content by type and language", async () => {
        vi.mocked(executeDocument)
            .mockResolvedValueOnce({
            success: true,
            data: {
                gaiaQueries: {
                    propertySet: { kind: "blog", typeName: "BOT_FAQ", language: "el" },
                },
            },
        })
            .mockResolvedValueOnce({
            success: true,
            data: {
                blogQueries: {
                    listBlogPosts: {
                        items: [
                            {
                                id: "1",
                                title: "Τι είναι το Language Transfer;",
                                content: "Ελληνικά",
                                language: "el",
                                type: null,
                            },
                        ],
                        pageInfo: {
                            page: 0,
                            size: 1,
                            totalPages: 1,
                            totalCount: 1,
                            hasNextPage: false,
                            hasPreviousPage: false,
                        },
                    },
                },
            },
        });
        const faq = await resolvePageData("faq", "language-transfer", {
            language: "el",
        });
        expect(faq.title).toBe("Τι είναι το Language Transfer;");
        expect(faq.body).toBe("Ελληνικά");
    });
});
