import { defineLoader } from "@sun/ssr";
import { executeDocument } from "~/utils/api.js";
import {
  PropertySetDocument,
  type PropertySetQuery,
  type PropertySetQueryVariables,
} from "~/generated/graphql.js";
import type { LanguageTransferFaq } from "~/types/faq.js";

const OWNER_KEY = "NieceScarlett";
const SET_NAME = "language-transfer";

/**
 * Server-side language-transfer FAQ loader.
 */
defineLoader({
  pattern: "language-transfer",
  async loader(params) {
    const language = (params.language as string) ?? "en";
    const result = await executeDocument<PropertySetQuery, PropertySetQueryVariables>(
      PropertySetDocument,
      { ownerKey: OWNER_KEY, name: SET_NAME, entry: `faq.${language}` }
    );
    const faq = result.success
      ? (result.data?.gaiaQueries.propertySet as LanguageTransferFaq | null)
      : null;
    return { faq: faq ?? {} };
  },
});
