import { EmbedMessage } from "./embed.js";
import { getState, setState, updateState } from "./interaction-state.js";
import { pageNavRow } from "./pagination-row.js";
import { chunkText } from "~/utils/pagination.js";
export const TEXT_VIEWER_PREFIX = "ns:text";
/**
 * Opens the paginated viewer for a text and stores its state.
 *
 * @param text the text with content loaded
 * @param ownerId the user who may control the viewer
 */
export function openViewer(text, ownerId) {
    const state = {
        ownerId,
        textId: text.id,
        title: text.title,
        level: text.level,
        language: text.language,
        pages: chunkText(text.content ?? "No content."),
        page: 0,
    };
    return { token: setState(state), state };
}
/**
 * Builds the embed for the viewer's current page.
 *
 * @param state the viewer state
 */
export function viewerEmbed(state) {
    return new EmbedMessage()
        .setTitle(state.title)
        .setBody(state.pages[state.page] ?? "")
        .setFooter(`${state.language} · ${state.level} · Page ${state.page + 1}/${state.pages.length}`)
        .build();
}
/**
 * Builds the prev/next row for the viewer.
 *
 * @param token the viewer token
 * @param page the current page
 * @param total the total number of pages
 */
export function viewerRow(token, page, total) {
    return pageNavRow(TEXT_VIEWER_PREFIX, token, page, total);
}
/**
 * Reads the token and direction from a viewer button custom id.
 *
 * @param customId the button custom id
 */
export function parseViewerToken(customId) {
    if (!customId.startsWith(`${TEXT_VIEWER_PREFIX}:`)) {
        return null;
    }
    const parts = customId.slice(`${TEXT_VIEWER_PREFIX}:`.length).split(":");
    if (parts.length !== 2) {
        return null;
    }
    if (parts[1] !== "prev" && parts[1] !== "next") {
        return null;
    }
    return { token: parts[0], direction: parts[1] };
}
/**
 * Handles a viewer prev/next button press.
 *
 * @param interaction the button interaction
 */
export async function handleViewerButton(interaction) {
    const parsed = parseViewerToken(interaction.customId);
    if (!parsed)
        return;
    const state = getState(parsed.token);
    if (!state || state.ownerId !== interaction.user.id) {
        await interaction.reply({ content: "That message is not yours to control.", ephemeral: true });
        return;
    }
    const next = parsed.direction === "prev" ? state.page - 1 : state.page + 1;
    if (next < 0 || next >= state.pages.length)
        return;
    updateState(parsed.token, { page: next });
    const updated = { ...state, page: next };
    await interaction.update({
        embeds: [viewerEmbed(updated)],
        components: [viewerRow(parsed.token, next, updated.pages.length)],
    });
}
