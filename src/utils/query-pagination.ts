import {
  FilterOperator,
  SortDirection,
  type PaginationInput,
} from "~/generated/graphql.js";
import type { QueryOperator, QuerySpec } from "~/types/query.js";

const OPERATOR_LOOKUP: Record<QueryOperator, FilterOperator> = {
  EQUALS: FilterOperator.Equals,
  NOT_EQUALS: FilterOperator.NotEquals,
  MATCHES: FilterOperator.Matches,
  STARTS_WITH: FilterOperator.StartsWith,
  ENDS_WITH: FilterOperator.EndsWith,
  GREATER_THAN: FilterOperator.GreaterThan,
  LESS_THAN: FilterOperator.LessThan,
  GREATER_THAN_OR_EQUAL: FilterOperator.GreaterThanOrEqual,
  LESS_THAN_OR_EQUAL: FilterOperator.LessThanOrEqual,
  IN: FilterOperator.In,
};

/**
 * Maps a query spec to the GraphQL pagination input.
 *
 * @param spec the parsed query spec
 * @param defaultSortBy the fallback sort field
 */
export function specToPagination(
  spec: QuerySpec,
  defaultSortBy = "level"
): PaginationInput {
  return {
    page: spec.page,
    size: spec.size ?? 10,
    sortBy: spec.sort?.by ?? defaultSortBy,
    sortDir: spec.sort?.dir === "DESC" ? SortDirection.Desc : SortDirection.Asc,
    filters:
      spec.filters.length > 0
        ? spec.filters.map((filter) => ({
            field: filter.field,
            operator: OPERATOR_LOOKUP[filter.operator],
            value: filter.value,
          }))
        : undefined,
  };
}
