import { defineLoader } from "@sun/ssr";
import { fetchLocateBlogPost } from "~/utils/api.js";
import type { BlogPost } from "~/generated/graphql.js";

const EMPTY_POST: BlogPost = {
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
    const id = params.id as string;
    const result = await fetchLocateBlogPost(id);
    const post = result.success ? result.data?.blogQueries.locateBlogPost : null;
    return { blogPost: post ?? EMPTY_POST };
  },
});
