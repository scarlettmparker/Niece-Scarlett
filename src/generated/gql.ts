/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "query listBlogPostsPaged($pagination: PaginationInput) {\n  blogQueries {\n    listBlogPosts(pagination: $pagination) {\n      items {\n        id\n        title\n        content\n        language\n        type {\n          id\n          name\n        }\n      }\n      pageInfo {\n        page\n        size\n        totalPages\n        totalCount\n        hasNextPage\n        hasPreviousPage\n      }\n    }\n  }\n}": typeof types.ListBlogPostsPagedDocument,
    "query locateBlogPost($id: ID!) {\n  blogQueries {\n    locateBlogPost(id: $id) {\n      id\n      title\n      content\n      language\n      type {\n        id\n        name\n      }\n    }\n  }\n}": typeof types.LocateBlogPostDocument,
    "query propertySet($ownerKey: String!, $name: String!, $entry: String) {\n  gaiaQueries {\n    propertySet(ownerKey: $ownerKey, name: $name, entry: $entry)\n  }\n}": typeof types.PropertySetDocument,
    "query listTexts($pagination: PaginationInput) {\n  hadesQueries {\n    texts(pagination: $pagination) {\n      items {\n        id\n        title\n        language\n        level\n        ownerId\n        sourceId\n        status\n      }\n      pageInfo {\n        page\n        size\n        totalPages\n        totalCount\n        hasNextPage\n        hasPreviousPage\n      }\n    }\n  }\n}": typeof types.ListTextsDocument,
    "query locateText($id: ID!) {\n  hadesQueries {\n    text(id: $id) {\n      id\n      title\n      content\n      language\n      level\n      ownerId\n      sourceId\n      status\n      createdAt\n      updatedAt\n    }\n  }\n}": typeof types.LocateTextDocument,
};
const documents: Documents = {
    "query listBlogPostsPaged($pagination: PaginationInput) {\n  blogQueries {\n    listBlogPosts(pagination: $pagination) {\n      items {\n        id\n        title\n        content\n        language\n        type {\n          id\n          name\n        }\n      }\n      pageInfo {\n        page\n        size\n        totalPages\n        totalCount\n        hasNextPage\n        hasPreviousPage\n      }\n    }\n  }\n}": types.ListBlogPostsPagedDocument,
    "query locateBlogPost($id: ID!) {\n  blogQueries {\n    locateBlogPost(id: $id) {\n      id\n      title\n      content\n      language\n      type {\n        id\n        name\n      }\n    }\n  }\n}": types.LocateBlogPostDocument,
    "query propertySet($ownerKey: String!, $name: String!, $entry: String) {\n  gaiaQueries {\n    propertySet(ownerKey: $ownerKey, name: $name, entry: $entry)\n  }\n}": types.PropertySetDocument,
    "query listTexts($pagination: PaginationInput) {\n  hadesQueries {\n    texts(pagination: $pagination) {\n      items {\n        id\n        title\n        language\n        level\n        ownerId\n        sourceId\n        status\n      }\n      pageInfo {\n        page\n        size\n        totalPages\n        totalCount\n        hasNextPage\n        hasPreviousPage\n      }\n    }\n  }\n}": types.ListTextsDocument,
    "query locateText($id: ID!) {\n  hadesQueries {\n    text(id: $id) {\n      id\n      title\n      content\n      language\n      level\n      ownerId\n      sourceId\n      status\n      createdAt\n      updatedAt\n    }\n  }\n}": types.LocateTextDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query listBlogPostsPaged($pagination: PaginationInput) {\n  blogQueries {\n    listBlogPosts(pagination: $pagination) {\n      items {\n        id\n        title\n        content\n        language\n        type {\n          id\n          name\n        }\n      }\n      pageInfo {\n        page\n        size\n        totalPages\n        totalCount\n        hasNextPage\n        hasPreviousPage\n      }\n    }\n  }\n}"): (typeof documents)["query listBlogPostsPaged($pagination: PaginationInput) {\n  blogQueries {\n    listBlogPosts(pagination: $pagination) {\n      items {\n        id\n        title\n        content\n        language\n        type {\n          id\n          name\n        }\n      }\n      pageInfo {\n        page\n        size\n        totalPages\n        totalCount\n        hasNextPage\n        hasPreviousPage\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query locateBlogPost($id: ID!) {\n  blogQueries {\n    locateBlogPost(id: $id) {\n      id\n      title\n      content\n      language\n      type {\n        id\n        name\n      }\n    }\n  }\n}"): (typeof documents)["query locateBlogPost($id: ID!) {\n  blogQueries {\n    locateBlogPost(id: $id) {\n      id\n      title\n      content\n      language\n      type {\n        id\n        name\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query propertySet($ownerKey: String!, $name: String!, $entry: String) {\n  gaiaQueries {\n    propertySet(ownerKey: $ownerKey, name: $name, entry: $entry)\n  }\n}"): (typeof documents)["query propertySet($ownerKey: String!, $name: String!, $entry: String) {\n  gaiaQueries {\n    propertySet(ownerKey: $ownerKey, name: $name, entry: $entry)\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query listTexts($pagination: PaginationInput) {\n  hadesQueries {\n    texts(pagination: $pagination) {\n      items {\n        id\n        title\n        language\n        level\n        ownerId\n        sourceId\n        status\n      }\n      pageInfo {\n        page\n        size\n        totalPages\n        totalCount\n        hasNextPage\n        hasPreviousPage\n      }\n    }\n  }\n}"): (typeof documents)["query listTexts($pagination: PaginationInput) {\n  hadesQueries {\n    texts(pagination: $pagination) {\n      items {\n        id\n        title\n        language\n        level\n        ownerId\n        sourceId\n        status\n      }\n      pageInfo {\n        page\n        size\n        totalPages\n        totalCount\n        hasNextPage\n        hasPreviousPage\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query locateText($id: ID!) {\n  hadesQueries {\n    text(id: $id) {\n      id\n      title\n      content\n      language\n      level\n      ownerId\n      sourceId\n      status\n      createdAt\n      updatedAt\n    }\n  }\n}"): (typeof documents)["query locateText($id: ID!) {\n  hadesQueries {\n    text(id: $id) {\n      id\n      title\n      content\n      language\n      level\n      ownerId\n      sourceId\n      status\n      createdAt\n      updatedAt\n    }\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;