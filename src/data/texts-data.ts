import { defineLoader } from "@sun/ssr";
import { executeDocument } from "~/utils/api.js";
import {
  type ListTextsQuery,
  type ListTextsQueryVariables,
} from "~/generated/graphql.js";
import { ListTextsDocument } from "~/generated/graphql.js";
import { specToPagination } from "~/utils/query-pagination.js";
import type { QuerySpec } from "~/types/query.js";

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

/**
 * Server-side paginated texts loader driven by a query spec.
 */
defineLoader({
  pattern: "texts",
  async loader(params) {
    const spec = (params.spec as QuerySpec | undefined) ?? {
      page: 0,
      filters: [],
    };
    const pagination = specToPagination(spec, "level");

    const result = await executeDocument<ListTextsQuery, ListTextsQueryVariables>(
      ListTextsDocument,
      { pagination }
    );
    const texts = result.success ? result.data?.hadesQueries.texts : null;
    return { texts: texts ?? EMPTY_PAGE };
  },
});
