import { beforeEach, describe, expect, it, vi } from "vitest";
import { executeDocument } from "@sun/api";
import {
  CefrLevel,
  ReaderTextStatus,
  type PagedReaderTexts,
} from "~/generated/graphql.js";
import "../../src/data/texts-data.js";
import { resolvePageData } from "~/utils/page-data.js";

vi.mock("@sun/api", () => ({
  executeDocument: vi.fn(),
}));

const PAGE: PagedReaderTexts = {
  items: [
    {
      id: "1",
      title: "Greek Myths",
      content: "",
      language: "el",
      level: CefrLevel.B1,
      ownerId: null,
      sourceId: null,
      status: ReaderTextStatus.Active,
    },
  ],
  pageInfo: {
    page: 0,
    size: 10,
    totalPages: 1,
    totalCount: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

describe("texts loader", () => {
  beforeEach(() => {
    vi.mocked(executeDocument).mockReset();
  });

  it("returns the texts when the request succeeds", async () => {
    vi.mocked(executeDocument).mockResolvedValue({
      success: true,
      data: { hadesQueries: { texts: PAGE } },
    });

    const data = await resolvePageData<PagedReaderTexts>("texts", "texts", {
      query: "greek",
      page: 0,
    });

    expect(data.items).toHaveLength(1);
    expect(data.items[0].title).toBe("Greek Myths");
  });

  it("returns an empty page when the request fails", async () => {
    vi.mocked(executeDocument).mockResolvedValue({
      success: false,
      error: "boom",
      statusCode: 500,
    });

    const data = await resolvePageData<PagedReaderTexts>("texts", "texts", {
      query: "none",
      page: 0,
    });

    expect(data.items).toEqual([]);
    expect(data.pageInfo.totalPages).toBe(0);
  });
});
