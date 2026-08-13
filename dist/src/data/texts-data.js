import { defineLoader } from "@sun/ssr";
import { executeDocument } from "~/utils/api.js";
import { FilterOperator, ListTextsDocument, SortDirection, } from "~/generated/graphql.js";
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
 * Server-side paginated texts loader with title and level filters.
 */
defineLoader({
    pattern: "texts",
    async loader(params) {
        const page = Number(params.page ?? 0);
        const query = params.query;
        const level = params.level;
        const filters = [];
        if (query) {
            filters.push({ field: "title", operator: FilterOperator.Matches, value: query });
        }
        if (level) {
            filters.push({ field: "level", operator: FilterOperator.In, value: level });
        }
        const pagination = {
            page,
            size: 10,
            sortBy: "level",
            sortDir: SortDirection.Asc,
            filters: filters.length > 0 ? filters : undefined,
        };
        const result = await executeDocument(ListTextsDocument, { pagination });
        const texts = result.success ? result.data?.hadesQueries.texts : null;
        return { texts: texts ?? EMPTY_PAGE };
    },
});
