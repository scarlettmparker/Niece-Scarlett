import { beforeEach, describe, expect, it, vi } from "vitest";
import { executeDocument } from "@sun/api";
import {
  CefrLevel,
  ReaderTextStatus,
  type ReaderText,
} from "~/generated/graphql.js";
import "../../src/data/text-data.js";
import { resolvePageData } from "~/utils/page-data.js";

vi.mock("@sun/api", () => ({
  executeDocument: vi.fn(),
}));

const TEXT: ReaderText = {
  id: "abc",
  title: "Greek Myths",
  content: "Once upon a time...",
  language: "en",
  level: CefrLevel.A1,
  ownerId: null,
  sourceId: null,
  status: ReaderTextStatus.Active,
};

describe("text loader", () => {
  beforeEach(() => {
    vi.mocked(executeDocument).mockReset();
  });

  it("returns the text when found", async () => {
    vi.mocked(executeDocument).mockResolvedValue({
      success: true,
      data: { hadesQueries: { text: TEXT } },
    });

    const data = await resolvePageData<ReaderText>("text", "texts/:id", { id: "abc" });

    expect(data.id).toBe("abc");
    expect(data.content).toBe("Once upon a time...");
  });

  it("returns an empty text when not found", async () => {
    vi.mocked(executeDocument).mockResolvedValue({
      success: true,
      data: { hadesQueries: { text: null } },
    });

    const data = await resolvePageData<ReaderText>("text", "texts/:id", { id: "missing" });

    expect(data.id).toBe("");
  });
});
