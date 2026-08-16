export { executeDocument } from "@sun/api";
export type { ApiResponse } from "@sun/api";

import { executeDocument } from "@sun/api";
import {
  ClassifyTextLevelDocument,
  DefineWordDocument,
  EffectivePermissionsDocument,
  FilterOperator,
  ListBlogPostsPagedDocument,
  ListBlogPostsByRemoteObjectsDocument,
  LocateBlogPostDocument,
  PropertySetDocument,
  RemoteUserType,
  SortDirection,
  AccessibleCommandIntentsDocument,
  type AccessibleCommandIntentsQuery,
  type AccessibleCommandIntentsQueryVariables,
  type ClassifyTextLevelQuery,
  type ClassifyTextLevelQueryVariables,
  type DefineWordQuery,
  type DefineWordQueryVariables,
  type EffectivePermissionsQuery,
  type EffectivePermissionsQueryVariables,
  type ListBlogPostsPagedQuery,
  type ListBlogPostsPagedQueryVariables,
  type ListBlogPostsByRemoteObjectsQuery,
  type ListBlogPostsByRemoteObjectsQueryVariables,
  type LocateBlogPostQuery,
  type LocateBlogPostQueryVariables,
  type PropertySetQuery,
  type PropertySetQueryVariables,
  type WordScope,
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
  entry?: string,
) {
  return executeDocument<PropertySetQuery, PropertySetQueryVariables>(
    PropertySetDocument,
    { ownerKey, name, entry: entry ?? null },
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
  language?: string,
) {
  const filters = [
    { field: "type.name", operator: FilterOperator.Equals, value: typeName },
  ];
  if (language) {
    filters.push({
      field: "language",
      operator: FilterOperator.Equals,
      value: language,
    });
  }
  return executeDocument<
    ListBlogPostsPagedQuery,
    ListBlogPostsPagedQueryVariables
  >(ListBlogPostsPagedDocument, {
    pagination: {
      page: 0,
      size: 1,
      sortBy: "createdAt",
      sortDir: SortDirection.Desc,
      filters,
    },
  });
}

/**
 * Fetches a single blog post by id.
 *
 * @param id the blog post id
 */
export async function fetchLocateBlogPost(id: string) {
  return executeDocument<LocateBlogPostQuery, LocateBlogPostQueryVariables>(
    LocateBlogPostDocument,
    { id },
  );
}

/**
 * Fetches blog posts by their remote-object ids.
 *
 * @param ids the remote-object ids to look up
 */
export async function fetchBlogPostsByRemoteObjects(ids: string[]) {
  return executeDocument<
    ListBlogPostsByRemoteObjectsQuery,
    ListBlogPostsByRemoteObjectsQueryVariables
  >(ListBlogPostsByRemoteObjectsDocument, { ids });
}

/**
 * Property-set entries the remote user may execute.
 *
 * @param discordId the Discord user id
 * @param ownerKey the property-set owner
 * @param propertySet the property-set name
 */
export async function fetchAccessibleCommands(
  discordId: string,
  ownerKey: string,
  propertySet: string,
) {
  return executeDocument<
    AccessibleCommandIntentsQuery,
    AccessibleCommandIntentsQueryVariables
  >(AccessibleCommandIntentsDocument, {
    remoteUserType: RemoteUserType.Discord,
    remoteUserId: discordId,
    ownerKey,
    propertySet,
  });
}

/**
 * Predicts the CEFR level of a text.
 *
 * @param text the text to classify
 */
export async function classifyText(text: string) {
  return executeDocument<
    ClassifyTextLevelQuery,
    ClassifyTextLevelQueryVariables
  >(ClassifyTextLevelDocument, { text });
}

/**
 * Fetches a Discord account's effective permission patterns.
 *
 * @param discordId the Discord user id
 */
export async function fetchEffectivePermissions(discordId: string) {
  return executeDocument<
    EffectivePermissionsQuery,
    EffectivePermissionsQueryVariables
  >(EffectivePermissionsDocument, {
    remoteUserType: RemoteUserType.Discord,
    remoteUserId: discordId,
  });
}

/**
 * Defines a word from WordReference, honoring the requested scopes.
 *
 * @param word the word to look up
 * @param scope the parts of the page to include
 */
export async function fetchDefineWord(word: string, scope: WordScope[]) {
  return executeDocument<DefineWordQuery, DefineWordQueryVariables>(
    DefineWordDocument,
    { word, scope }
  );
}
