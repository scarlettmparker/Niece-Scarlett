/* eslint-disable */
import * as types from './graphql';
const documents = {
    "query listBlogPostsPaged($pagination: PaginationInput) {\n  blogQueries {\n    listBlogPosts(pagination: $pagination) {\n      items {\n        id\n        title\n        content\n        language\n        type {\n          id\n          name\n        }\n      }\n      pageInfo {\n        page\n        size\n        totalPages\n        totalCount\n        hasNextPage\n        hasPreviousPage\n      }\n    }\n  }\n}": types.ListBlogPostsPagedDocument,
    "query locateBlogPost($id: ID!) {\n  blogQueries {\n    locateBlogPost(id: $id) {\n      id\n      title\n      content\n      language\n      type {\n        id\n        name\n      }\n    }\n  }\n}": types.LocateBlogPostDocument,
    "query propertySet($ownerKey: String!, $name: String!, $entry: String) {\n  gaiaQueries {\n    propertySet(ownerKey: $ownerKey, name: $name, entry: $entry)\n  }\n}": types.PropertySetDocument,
    "query listTexts($pagination: PaginationInput) {\n  hadesQueries {\n    texts(pagination: $pagination) {\n      items {\n        id\n        title\n        language\n        level\n        ownerId\n        sourceId\n        status\n      }\n      pageInfo {\n        page\n        size\n        totalPages\n        totalCount\n        hasNextPage\n        hasPreviousPage\n      }\n    }\n  }\n}": types.ListTextsDocument,
    "query locateText($id: ID!) {\n  hadesQueries {\n    text(id: $id) {\n      id\n      title\n      content\n      language\n      level\n      ownerId\n      sourceId\n      status\n      createdAt\n      updatedAt\n    }\n  }\n}": types.LocateTextDocument,
};
export function graphql(source) {
    return documents[source] ?? {};
}
