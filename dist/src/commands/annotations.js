import { SlashCommandBuilder, } from "discord.js";
import { resolvePageData } from "~/utils/page-data.js";
import { sendable } from "~/utils/sendable.js";
import { showAnnotationListDeferred, showAnnotationListMessage, } from "~/components/annotation-list.js";
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
/**
 * Resolves a term to a text, searching by title when it is not an id.
 *
 * @param term the id or title search
 * @return the matching text, or "multiple" when the search is ambiguous
 */
async function resolveText(term) {
    if (UUID_REGEX.test(term)) {
        const text = await resolvePageData("text", "texts/:id", { id: term });
        if (text.id)
            return { id: text.id, title: text.title };
        return null;
    }
    const result = await resolvePageData("texts", "texts", {
        spec: {
            page: 0,
            filters: [{ field: "title", operator: "MATCHES", value: term }],
            search: term,
        },
    });
    if (result.items.length > 1)
        return "multiple";
    if (result.items.length === 1) {
        const t = result.items[0];
        return { id: t.id, title: t.title };
    }
    return null;
}
function parseIncludeHidden(args) {
    const lower = args.map((a) => a.toLowerCase());
    return lower.includes("hidden") || lower.includes("include");
}
function parseSortSpec(args) {
    const joined = args.join(" ").toLowerCase();
    if (joined.includes("newest") || joined.includes("created")) {
        return { by: "createdAt", dir: "DESC" };
    }
    if (joined.includes("updated")) {
        return { by: "updatedAt", dir: "DESC" };
    }
    if (joined.includes("popular") || joined.includes("votes")) {
        return { by: "upvotes", dir: "DESC" };
    }
    return { by: "createdAt", dir: "DESC" };
}
function cleanSearchTerm(args) {
    const skip = new Set([
        "for", "annotations", "annotation", "notes", "text",
        "sort", "by", "on", "include", "hidden", "newest", "created",
        "updated", "popular", "votes",
    ]);
    return args.filter((a) => !skip.has(a.toLowerCase())).join(" ");
}
async function openForInteraction(interaction, term) {
    await interaction.deferReply({ ephemeral: true });
    const resolved = await resolveText(term);
    if (resolved === "multiple") {
        const spec = {
            page: 0,
            filters: [{ field: "title", operator: "MATCHES", value: term }],
            search: term,
        };
        const { showTextListDeferred } = await import("~/components/text-list.js");
        await showTextListDeferred(interaction, spec);
        return;
    }
    if (!resolved) {
        await interaction.editReply({ content: "No text found." });
        return;
    }
    const sort = parseSortSpec(interaction.options.getString("text")?.split(" ") ?? []);
    const spec = { page: 0, filters: [], sort };
    await showAnnotationListDeferred(interaction, resolved.id, resolved.title, spec, false);
}
async function openForMessage(message, args) {
    const channel = message.channel;
    if (!sendable(channel))
        return;
    const includeHidden = parseIncludeHidden(args);
    const sort = parseSortSpec(args);
    const searchTerm = cleanSearchTerm(args);
    if (!searchTerm) {
        await message.reply("Usage: `ns annotations for <text title or id>`");
        return;
    }
    const resolved = await resolveText(searchTerm);
    if (resolved === "multiple") {
        const spec = {
            page: 0,
            filters: [{ field: "title", operator: "MATCHES", value: searchTerm }],
            search: searchTerm,
        };
        const { showTextListMessage } = await import("~/components/text-list.js");
        await showTextListMessage(message, spec);
        return;
    }
    if (!resolved) {
        await message.reply("No text found.");
        return;
    }
    const spec = { page: 0, filters: [], sort };
    await showAnnotationListMessage(message, resolved.id, resolved.title, spec, includeHidden);
}
/**
 * List annotations for a text.
 */
const command = {
    name: "annotations",
    aliases: ["annotation", "notes"],
    description: "List annotations for a text",
    data: new SlashCommandBuilder()
        .setName("annotations")
        .setDescription("List annotations for a text")
        .addStringOption((option) => option
        .setName("text")
        .setDescription("Text id or title search")
        .setRequired(true)),
    async messageExecute(message, args) {
        await openForMessage(message, args);
    },
    async interactionExecute(interaction) {
        const term = interaction.options.getString("text", true);
        await openForInteraction(interaction, term);
    },
};
export default command;
