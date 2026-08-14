export { executeDocument } from "@sun/api";
import { executeDocument } from "@sun/api";
import { FilterOperator, ListBlogPostsPagedDocument, LocateBlogPostDocument, PropertySetDocument, SortDirection, } from "~/generated/graphql.js";
/**
 * Fetches a property-set entry's values, or all entries when entry is omitted.
 *
 * @param ownerKey the owner key
 * @param name the property set name
 * @param entry the entry name, or all entries when omitted
 */
export async function fetchPropertySet(ownerKey, name, entry) {
    return executeDocument(PropertySetDocument, { ownerKey, name, entry: entry ?? null });
}
/**
 * Fetches the newest blog posts of a type, optionally narrowed by language.
 *
 * @param typeName the blog post type name
 * @param language the post language, when set
 */
export async function fetchBlogPostsByType(typeName, language) {
    const filters = [{ field: "type.name", operator: FilterOperator.Equals, value: typeName }];
    if (language) {
        filters.push({ field: "language", operator: FilterOperator.Equals, value: language });
    }
    return executeDocument(ListBlogPostsPagedDocument, {
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
export async function fetchLocateBlogPost(id) {
    return executeDocument(LocateBlogPostDocument, { id });
}
