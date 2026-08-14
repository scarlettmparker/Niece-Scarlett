export { executeDocument } from "@sun/api";
export type { ApiResponse } from "@sun/api";

import { executeDocument } from "@sun/api";
import {
  ClassifyTextLevelDocument,
  FilterOperator,
  ListBlogPostsPagedDocument,
  LocateBlogPostDocument,
  PropertySetDocument,
  SortDirection,
  type ClassifyTextLevelQuery,
  type ClassifyTextLevelQueryVariables,
  type ListBlogPostsPagedQuery,
  type ListBlogPostsPagedQueryVariables,
  type LocateBlogPostQuery,
  type LocateBlogPostQueryVariables,
  type PropertySetQuery,
  type PropertySetQueryVariables,
} from "~/generated/graphql.js";

/**
 * Fetches a property-set entry's values, or all entries when entry is omitted.
 *
 * @param ownerKey the owner key
 * @param name the property set name
 * @param entry the entry name, or all entries when omitted
 */
export async function fetchPropertySet(
  ownerKey: string,
  name: string,
  entry?: string
) {
  return executeDocument<PropertySetQuery, PropertySetQueryVariables>(
    PropertySetDocument,
    { ownerKey, name, entry: entry ?? null }
  );
}

/**
 * Fetches the newest blog posts of a type, optionally narrowed by language.
 *
 * @param typeName the blog post type name
 * @param language the post language, when set
 */
export async function fetchBlogPostsByType(
  typeName: string,
  language?: string
) {
  const filters = [{ field: "type.name", operator: FilterOperator.Equals, value: typeName }];
  if (language) {
    filters.push({ field: "language", operator: FilterOperator.Equals, value: language });
  }
  return executeDocument<ListBlogPostsPagedQuery, ListBlogPostsPagedQueryVariables>(
    ListBlogPostsPagedDocument,
    {
      pagination: {
        page: 0,
        size: 1,
        sortBy: "createdAt",
        sortDir: SortDirection.Desc,
        filters,
      },
    }
  );
}

/**
 * Fetches a single blog post by id.
 *
 * @param id the blog post id
 */
export async function fetchLocateBlogPost(id: string) {
  return executeDocument<LocateBlogPostQuery, LocateBlogPostQueryVariables>(
    LocateBlogPostDocument,
    { id }
  );
}

/**
 * Predicts the CEFR level of a text.
 *
 * @param text the text to classify
 */
export async function classifyText(text: string) {
  return executeDocument<ClassifyTextLevelQuery, ClassifyTextLevelQueryVariables>(
    ClassifyTextLevelDocument,
    { text }
  );
}
