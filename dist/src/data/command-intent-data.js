import { defineLoader } from "@sun/ssr";
import { fetchPropertySet } from "~/utils/api.js";
const OWNER_KEY = "NieceScarlett";
const SET_NAME = "command-intents";
/**
 * Server-side single command-intent loader.
 */
defineLoader({
    pattern: "command-intent/:name",
    async loader(params) {
        const name = params.name;
        const result = await fetchPropertySet(OWNER_KEY, SET_NAME, name);
        const entry = result.success
            ? result.data?.gaiaQueries.propertySet
            : null;
        const intent = entry
            ? {
                name,
                command: entry.command ?? name,
                words: entry.words ?? [],
                query: entry.query,
            }
            : { name, command: name, words: [], query: undefined };
        return { intent };
    },
});
