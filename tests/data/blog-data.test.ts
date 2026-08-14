import { beforeEach, describe, expect, it, vi } from "vitest";
import { executeDocument } from "@sun/api";
import "../../src/data/blog-data.js";
import type { BlogPost } from "~/generated/graphql.js";
import { resolvePageData } from "~/utils/page-data.js";

vi.mock("@sun/api", () => ({
  executeDocument: vi.fn(),
}));

describe("blog loader", () => {
  beforeEach(() => {
    vi.mocked(executeDocument).mockReset();
  });

  it("returns the post when found", async () => {
    vi.mocked(executeDocument).mockResolvedValue({
      success: true,
      data: {
        blogQueries: {
          locateBlogPost: {
            id: "1",
            title: "What is Language Transfer?",
            content: "body",
            language: "en",
            type: null,
          },
        },
      },
    });

    const post = await resolvePageData<BlogPost>("blogPost", "blog/:id", { id: "1" });

    expect(post.title).toBe("What is Language Transfer?");
    expect(post.content).toBe("body");
  });

  it("returns an empty post when missing", async () => {
    vi.mocked(executeDocument).mockResolvedValue({
      success: true,
      data: { blogQueries: { locateBlogPost: null } },
    });

    const post = await resolvePageData<BlogPost>("blogPost", "blog/:id", { id: "missing" });

    expect(post.id).toBe("");
  });
});
