import { defineLoader } from "@sun/ssr";
import { fetchLocateBlogPost } from "~/utils/api.js";
const EMPTY_POST = {
    id: "",
    title: "",
    content: "",
    language: null,
    type: null,
};
/**
 * Server-side blog-post-by-id loader.
 */
defineLoader({
    pattern: "blog/:id",
    async loader(params) {
        const id = params.id;
        const result = await fetchLocateBlogPost(id);
        const post = result.success ? result.data?.blogQueries.locateBlogPost : null;
        return { blogPost: post ?? EMPTY_POST };
    },
});
