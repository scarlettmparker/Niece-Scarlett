import { defineLoader } from "@sun/ssr";
import { executeDocument } from "~/utils/api.js";
import {
  ListAnnotationsDocument,
  type ListAnnotationsQuery,
  type ListAnnotationsQueryVariables,
} from "~/generated/graphql.js";
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

defineLoader({
  pattern: "annotations",
  async loader(params) {
    const textId = params.textId as string;
    const spec = (params.spec as QuerySpec | undefined) ?? { page: 0, filters: [] };
    const includeHidden = params.includeHidden === "true";
    const pagination = specToPagination(spec, "createdAt");
    const result = await executeDocument<ListAnnotationsQuery, ListAnnotationsQueryVariables>(
      ListAnnotationsDocument,
      { textId, includeHidden, pagination },
    );
    const annotations = result.success ? result.data?.hadesQueries.annotations : null;
    return { annotations: annotations ?? EMPTY_PAGE };
  },
});
