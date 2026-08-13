import { defineLoader } from "@sun/ssr";
import { executeDocument } from "~/utils/api.js";
import { PropertySetDocument, } from "~/generated/graphql.js";
const OWNER_KEY = "NieceScarlett";
const SET_NAME = "language-transfer";
/**
 * Server-side language-transfer FAQ loader.
 */
defineLoader({
    pattern: "language-transfer",
    async loader(params) {
        const language = params.language ?? "en";
        const result = await executeDocument(PropertySetDocument, { ownerKey: OWNER_KEY, name: SET_NAME, entry: `faq.${language}` });
        const faq = result.success
            ? result.data?.gaiaQueries.propertySet
            : null;
        return { faq: faq ?? {} };
    },
});
