import { defineLoader } from "@sun/ssr";
import { executeDocument } from "~/utils/api.js";
import { CefrLevel, LocateTextDocument, ReaderTextStatus, } from "~/generated/graphql.js";
const EMPTY_TEXT = {
    id: "",
    title: "",
    content: "",
    language: "",
    level: CefrLevel.A1,
    ownerId: null,
    sourceId: null,
    status: ReaderTextStatus.Active,
};
/**
 * Server-side text-by-id loader.
 */
defineLoader({
    pattern: "texts/:id",
    async loader(params) {
        const id = params.id;
        const result = await executeDocument(LocateTextDocument, { id });
        const text = result.success ? result.data?.hadesQueries.text : null;
        return { text: text ?? EMPTY_TEXT };
    },
});
