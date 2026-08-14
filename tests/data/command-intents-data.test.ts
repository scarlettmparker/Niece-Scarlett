import { beforeEach, describe, expect, it, vi } from "vitest";
import { executeDocument } from "@sun/api";
import "../../src/data/command-intents-data.js";
import type { CommandIntent } from "~/utils/intents.js";
import { resolvePageData } from "~/utils/page-data.js";

vi.mock("@sun/api", () => ({
  executeDocument: vi.fn(),
}));

describe("command-intents loader", () => {
  beforeEach(() => {
    vi.mocked(executeDocument).mockReset();
  });

  it("returns the intents from the property set", async () => {
    vi.mocked(executeDocument).mockResolvedValue({
      success: true,
      data: {
        gaiaQueries: {
          propertySet: {
            texts: { command: "texts", words: ["texts", "reader"] },
            lt: { command: "lt", words: ["language", "transfer"] },
          },
        },
      },
    });

    const intents = await resolvePageData<CommandIntent[]>("intents", "command-intents", { variant: "present" });

    expect(intents).toHaveLength(2);
    expect(intents[0].command).toBe("texts");
    expect(intents[0].words).toEqual(["texts", "reader"]);
  });

  it("returns an empty list when the property set is missing", async () => {
    vi.mocked(executeDocument).mockResolvedValue({
      success: false,
      error: "boom",
      statusCode: 400,
    });

    const intents = await resolvePageData<CommandIntent[]>("intents", "command-intents", { variant: "missing" });

    expect(intents).toEqual([]);
  });
});
