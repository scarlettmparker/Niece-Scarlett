import { defineLoader } from "@sun/ssr";
import { executeDocument } from "~/utils/api.js";
import {
  CefrLevel,
  LocateTextDocument,
  ReaderTextStatus,
  type LocateTextQuery,
  type LocateTextQueryVariables,
  type ReaderText,
} from "~/generated/graphql.js";

const EMPTY_TEXT: ReaderText = {
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
    const id = params.id as string;
    const result = await executeDocument<LocateTextQuery, LocateTextQueryVariables>(
      LocateTextDocument,
      { id }
    );
    const text = result.success ? result.data?.hadesQueries.text : null;
    return { text: text ?? EMPTY_TEXT };
  },
});
