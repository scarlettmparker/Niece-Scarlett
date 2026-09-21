export { executeDocument } from "@sun/api";
import { executeDocument } from "@sun/api";
import { AccessibleCommandIntentsDocument, ClassifyTextLevelDocument, DefineWordDocument, EffectivePermissionsDocument, FilterOperator, ListAnnotationsDocument, ListBlogPostsPagedDocument, ListBlogPostsByRemoteObjectsDocument, LocateAnnotationDocument, LocateBlogPostDocument, PropertySetDocument, RemoteUserType, SortDirection, } from "~/generated/graphql.js";
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
/**
 * Fetches blog posts by their remote-object ids.
 *
 * @param ids the remote-object ids to look up
 */
export async function fetchBlogPostsByRemoteObjects(ids) {
    return executeDocument(ListBlogPostsByRemoteObjectsDocument, { ids });
}
/**
 * Property-set entries the remote user may execute.
 *
 * @param discordId the Discord user id
 * @param ownerKey the property-set owner
 * @param propertySet the property-set name
 */
export async function fetchAccessibleCommands(discordId, ownerKey, propertySet) {
    return executeDocument(AccessibleCommandIntentsDocument, {
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
export async function classifyText(text) {
    return executeDocument(ClassifyTextLevelDocument, { text });
}
/**
 * Fetches a Discord account's effective permission patterns.
 *
 * @param discordId the Discord user id
 */
export async function fetchEffectivePermissions(discordId) {
    return executeDocument(EffectivePermissionsDocument, {
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
export async function fetchDefineWord(word, scope) {
    return executeDocument(DefineWordDocument, { word, scope });
}
/**
 * Paginated annotations for a text.
 *
 * @param textId the text id
 * @param pagination the page request
 * @param includeHidden whether to include hidden annotations
 */
export async function fetchAnnotations(textId, pagination, includeHidden = false) {
    return executeDocument(ListAnnotationsDocument, {
        textId,
        includeHidden,
        pagination: {
            page: pagination.page,
            size: pagination.size ?? 10,
            sortBy: pagination.sortBy ?? "createdAt",
            sortDir: pagination.sortDir ?? SortDirection.Desc,
        },
    });
}
/**
 * A single annotation by id.
 *
 * @param id the annotation id
 */
export async function fetchAnnotation(id) {
    return executeDocument(LocateAnnotationDocument, { id });
}
