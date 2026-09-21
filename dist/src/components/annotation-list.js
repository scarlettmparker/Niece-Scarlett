import { EmbedMessage } from "~/components/embed.js";
import { pageNavRow } from "~/components/pagination-row.js";
import { getState, setState, updateState, } from "~/components/interaction-state.js";
import { resolvePageData } from "~/utils/page-data.js";
import { sendable } from "~/utils/sendable.js";
const PAGE_PREFIX = "ns:ann";
const PAGE_SIZE = 10;
function authorName(a) {
    return a.authorProfile?.globalName ?? a.authorProfile?.discordUsername ?? "Unknown";
}
function truncate(body, max) {
    return body.length > max ? body.slice(0, max) + "..." : body;
}
function formatDate(dateStr) {
    if (!dateStr)
        return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffDays === 0)
        return "today";
    if (diffDays === 1)
        return "yesterday";
    if (diffDays < 7)
        return `${diffDays} days ago`;
    if (diffDays < 30)
        return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
}
function buildAnnotationEmbed(state, items) {
    const embed = new EmbedMessage()
        .setTitle(`Annotations for ${state.textTitle}`)
        .setFooter(`Page ${state.spec.page + 1}/${Math.max(state.totalPages, 1)}`);
    if (!items.length) {
        return embed.setBody("No annotations found.").build();
    }
    const lines = items.map((a, i) => {
        const offset = state.spec.page * PAGE_SIZE;
        const date = formatDate(a.createdAt);
        const body = truncate(a.body, 100);
        return [
            `**${offset + i + 1}. ${authorName(a)}** · ${date}`,
            body,
            `▲ ${a.upvotes} ▼ ${a.downvotes}`,
        ].join("\n");
    });
    return embed.setBody(lines.join("\n\n")).build();
}
function buildPageNav(token, page, totalPages) {
    return pageNavRow(PAGE_PREFIX, token, page, totalPages);
}
export function isAnnotationListId(customId) {
    return customId.startsWith(PAGE_PREFIX) && !customId.includes(":select");
}
export async function handleAnnotationListPage(interaction) {
    const parts = interaction.customId.split(":");
    const token = parts[2];
    const direction = parts[3];
    const state = getState(token);
    if (!state || state.ownerId !== interaction.user.id) {
        await interaction.reply({ content: "This list has expired.", ephemeral: true });
        return;
    }
    const nextPage = direction === "next" ? state.spec.page + 1 : state.spec.page - 1;
    if (nextPage < 0 || nextPage >= state.totalPages)
        return;
    const newSpec = { ...state.spec, page: nextPage };
    updateState(token, { spec: newSpec });
    await interaction.deferUpdate();
    const result = await resolvePageData("annotations", "annotations", {
        textId: state.textId,
        spec: newSpec,
        includeHidden: state.includeHidden ? "true" : "false",
    });
    const embed = buildAnnotationEmbed({ ...state, spec: newSpec, totalPages: result.pageInfo.totalPages }, result.items);
    await interaction.editReply({
        embeds: [embed],
        components: [buildPageNav(token, nextPage, result.pageInfo.totalPages)],
    });
}
export async function showAnnotationListMessage(message, textId, textTitle, spec, includeHidden) {
    const channel = message.channel;
    if (!sendable(channel))
        return;
    const result = await resolvePageData("annotations", "annotations", {
        textId,
        spec,
        includeHidden: includeHidden ? "true" : "false",
    });
    const state = {
        ownerId: message.author.id,
        textId,
        textTitle,
        spec,
        totalPages: result.pageInfo.totalPages,
        includeHidden,
    };
    const token = setState(state);
    const embed = buildAnnotationEmbed(state, result.items);
    const components = result.items.length
        ? [buildPageNav(token, spec.page, result.pageInfo.totalPages)]
        : [];
    await channel.send({ embeds: [embed], components });
}
export async function showAnnotationListDeferred(interaction, textId, textTitle, spec, includeHidden) {
    const result = await resolvePageData("annotations", "annotations", {
        textId,
        spec,
        includeHidden: includeHidden ? "true" : "false",
    });
    const state = {
        ownerId: interaction.user.id,
        textId,
        textTitle,
        spec,
        totalPages: result.pageInfo.totalPages,
        includeHidden,
    };
    const token = setState(state);
    const embed = buildAnnotationEmbed(state, result.items);
    const components = result.items.length
        ? [buildPageNav(token, spec.page, result.pageInfo.totalPages)]
        : [];
    await interaction.editReply({ embeds: [embed], components });
}
