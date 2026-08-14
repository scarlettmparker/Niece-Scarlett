import { beforeEach, describe, expect, it, vi } from "vitest";
import { executeDocument } from "@sun/api";
import { ListTextsDocument, type ListTextsQueryVariables } from "~/generated/graphql.js";
import "../../src/data/texts-data.js";
import type { PagedReaderTexts } from "~/generated/graphql.js";
import { resolvePageData } from "~/utils/page-data.js";
import type { QuerySpec } from "~/types/query.js";

vi.mock("@sun/api", () => ({
  executeDocument: vi.fn(),
}));

const EMPTY_PAGE = {
  items: [],
  pageInfo: {
    page: 0,
    size: 0,
    totalPages: 0,
    totalCount: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

describe("texts loader", () => {
  beforeEach(() => {
    vi.mocked(executeDocument).mockReset();
    vi.mocked(executeDocument).mockResolvedValue({
      success: true,
      data: { hadesQueries: { texts: EMPTY_PAGE } },
    });
  });

  it("maps a query spec into pagination input", async () => {
    const spec: QuerySpec = {
      page: 1,
      filters: [
        { field: "level", operator: "IN", value: "A1,B2" },
        { field: "title", operator: "MATCHES", value: "summer" },
      ],
      sort: { by: "title", dir: "DESC" },
      search: "summer",
    };

    await resolvePageData<PagedReaderTexts>("texts", "texts", { spec });

    expect(vi.mocked(executeDocument)).toHaveBeenCalledWith(
      ListTextsDocument,
      {
        pagination: {
          page: 1,
          size: 10,
          sortBy: "title",
          sortDir: "DESC",
          filters: [
            { field: "level", operator: "IN", value: "A1,B2" },
            { field: "title", operator: "MATCHES", value: "summer" },
          ],
        },
      }
    );
  });

  it("defaults page and sort when the spec has neither", async () => {
    await resolvePageData<PagedReaderTexts>("texts", "texts", {
      spec: { page: 0, filters: [] },
    });

    const call = vi.mocked(executeDocument).mock.calls[0][1] as ListTextsQueryVariables;
    expect(call.pagination?.page).toBe(0);
    expect(call.pagination?.size).toBe(10);
    expect(call.pagination?.sortBy).toBe("level");
    expect(call.pagination?.sortDir).toBe("ASC");
    expect(call.pagination?.filters).toBeUndefined();
  });
});
