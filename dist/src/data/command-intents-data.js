import { defineLoader } from "@sun/ssr";
import { fetchPropertySet } from "~/utils/api.js";
const OWNER_KEY = "NieceScarlett";
const SET_NAME = "command-intents";
/**
 * Server-side command-intent word-cloud loader.
 */
defineLoader({
    pattern: "command-intents",
    async loader() {
        const result = await fetchPropertySet(OWNER_KEY, SET_NAME);
        const map = result.success ? result.data?.gaiaQueries.propertySet : null;
        const intents = Object.entries(map ?? {}).map(([name, entry]) => ({
            name,
            command: entry.command,
            words: entry.words ?? [],
        }));
        return { intents };
    },
});
