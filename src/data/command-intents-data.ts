import { defineLoader } from "@sun/ssr";
import { fetchPropertySet } from "~/utils/api.js";
import type { CommandIntent } from "~/utils/intents.js";
import type { QuerySchema } from "~/types/query.js";

const OWNER_KEY = "NieceScarlett";
const SET_NAME = "command-intents";

/**
 * Server-side command-intent word-cloud loader.
 */
defineLoader({
  pattern: "command-intents",
  async loader() {
    const result = await fetchPropertySet(OWNER_KEY, SET_NAME);
    const map = result.success
      ? (result.data?.gaiaQueries.propertySet as
          | Record<string, { command: string; words?: string[]; query?: QuerySchema }>
          | null)
      : null;
    const intents: CommandIntent[] = Object.entries(map ?? {}).map(([name, entry]) => ({
      name,
      command: entry.command,
      words: entry.words ?? [],
      query: entry.query,
    }));
    return { intents };
  },
});
