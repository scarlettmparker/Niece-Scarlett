import { defineLoader } from "@sun/ssr";
import { fetchBlogPostsByType, fetchLocateBlogPost, fetchPropertySet } from "~/utils/api.js";
import { buildFaqBody, } from "~/types/faq.js";
const OWNER_KEY = "NieceScarlett";
const SET_NAME = "language-transfer";
const FALLBACK_LANGUAGE = "en";
const EMPTY_FAQ = { title: "", body: "", footer: "" };
/**
 * Server-side language-transfer FAQ loader, resolving blog-backed content.
 */
defineLoader({
    pattern: "language-transfer",
    async loader(params) {
        const language = params.language ?? "en";
        const result = await fetchPropertySet(OWNER_KEY, SET_NAME, `faq.${language}`);
        const entry = result.success
            ? result.data?.gaiaQueries.propertySet
            : null;
        const faq = await resolveEntry(entry);
        if (!faq && language !== FALLBACK_LANGUAGE) {
            const fallback = await fetchPropertySet(OWNER_KEY, SET_NAME, `faq.${FALLBACK_LANGUAGE}`);
            const fallbackEntry = fallback.success
                ? fallback.data?.gaiaQueries.propertySet
                : null;
            return { faq: (await resolveEntry(fallbackEntry)) ?? EMPTY_FAQ };
        }
        return { faq: faq ?? EMPTY_FAQ };
    },
});
/**
 * Resolves an entry to render-ready content, fetching the blog when referenced.
 *
 * @param entry the property-set entry
 * @return the resolved FAQ, or null when unreadable
 */
async function resolveEntry(entry) {
    if (!entry) {
        return null;
    }
    if (entry.kind === "blog") {
        return resolveBlog(entry);
    }
    const content = entry.content;
    if (content) {
        return { title: content.title ?? "", body: buildFaqBody(content), footer: content.footer ?? "" };
    }
    return null;
}
/**
 * Loads a blog post referenced by the entry and renders it.
 *
 * @param entry the blog-backed entry
 * @return the rendered FAQ, or null when the post is missing
 */
async function resolveBlog(entry) {
    if (entry.remoteObject) {
        const match = /^briareus:post:(.+)$/.exec(entry.remoteObject);
        const id = match ? match[1] : null;
        if (!id) {
            return null;
        }
        return postToFaq((await fetchLocateBlogPost(id)).data?.blogQueries.locateBlogPost ?? null);
    }
    if (entry.typeName) {
        const result = await fetchBlogPostsByType(entry.typeName, entry.language);
        const post = result.data?.blogQueries.listBlogPosts.items[0] ?? null;
        return postToFaq(post);
    }
    return null;
}
/**
 * Converts a blog post into render-ready FAQ content.
 *
 * @param post the blog post, or null when missing
 * @return the rendered FAQ, or null when the post is missing
 */
function postToFaq(post) {
    if (!post) {
        return null;
    }
    return { title: post.title, body: post.content ?? "", footer: "" };
}
