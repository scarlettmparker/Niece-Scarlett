import { ActionRowBuilder, StringSelectMenuBuilder, } from "discord.js";
import { EmbedMessage } from "./embed.js";
import { getState, setState, updateState } from "./interaction-state.js";
import { pageNavRow } from "./pagination-row.js";
import { openViewer, viewerEmbed, viewerRow } from "./text-viewer.js";
import { resolvePageData } from "~/utils/page-data.js";
import { sendable } from "~/utils/sendable.js";
const LIST_PREFIX = "ns:list";
const LIST_SELECT_PREFIX = "ns:list:select";
const MAX_OPTIONS = 25;
/**
 * Shows the interactive text list to a slash command user (ephemeral).
 *
 * @param interaction the command interaction
 * @param query optional title search
 * @param level optional CEFR level
 */
export async function showTextList(interaction, query, level) {
    const state = {
        ownerId: interaction.user.id,
        query,
        level,
        page: 0,
        totalPages: 1,
    };
    const token = setState(state);
    const render = await buildTextList(state, token);
    await interaction.reply({ embeds: [render.embed], components: render.components, ephemeral: true });
}
/**
 * Shows the interactive text list in a message's channel.
 *
 * @param message the message that invoked the command
 * @param query optional title search
 * @param level optional CEFR level
 */
export async function showTextListMessage(message, query, level) {
    if (!sendable(message.channel))
        return;
    const state = {
        ownerId: message.author.id,
        query,
        level,
        page: 0,
        totalPages: 1,
    };
    const token = setState(state);
    const render = await buildTextList(state, token);
    await message.channel.send({ embeds: [render.embed], components: render.components });
}
async function buildTextList(state, token) {
    const result = await resolvePageData("texts", "texts", {
        query: state.query,
        level: state.level,
        page: state.page,
    });
    const texts = result.items;
    const totalPages = Math.max(result.pageInfo.totalPages, 1);
    updateState(token, { totalPages });
    const embed = new EmbedMessage()
        .setTitle(state.query ? `Texts matching "${state.query}"` : "Texts")
        .setBody(texts.length > 0
        ? texts
            .map((text, index) => `${index + 1}. **${text.title}** — ${text.level} · ${text.language}`)
            .join("\n")
        : "No texts found.")
        .setFooter(`Page ${state.page + 1}/${totalPages}`)
        .build();
    const components = [];
    if (texts.length > 0) {
        components.push(selectRow(token, texts));
    }
    components.push(pageRow(token, state.page, totalPages));
    return { embed, components };
}
function selectRow(token, texts) {
    return new ActionRowBuilder().addComponents(new StringSelectMenuBuilder()
        .setCustomId(`${LIST_SELECT_PREFIX}:${token}`)
        .setPlaceholder("Choose a text to read")
        .addOptions(texts.slice(0, MAX_OPTIONS).map((text) => ({
        label: text.title.slice(0, 100),
        value: text.id,
        description: `${text.level} · ${text.language}`,
    }))));
}
function pageRow(token, page, totalPages) {
    return pageNavRow(LIST_PREFIX, token, page, totalPages);
}
function parseListToken(customId) {
    const parts = customId.split(":");
    if (parts.length !== 3 || parts[0] !== LIST_PREFIX) {
        return null;
    }
    if (parts[2] !== "prev" && parts[2] !== "next") {
        return null;
    }
    return { token: parts[1], direction: parts[2] };
}
/**
 * Handles a text list prev/next button press.
 *
 * @param interaction the button interaction
 */
export async function handleListPage(interaction) {
    const parsed = parseListToken(interaction.customId);
    if (!parsed)
        return;
    const state = getState(parsed.token);
    if (!state || state.ownerId !== interaction.user.id) {
        await interaction.reply({ content: "That message is not yours to control.", ephemeral: true });
        return;
    }
    const next = parsed.direction === "prev" ? state.page - 1 : state.page + 1;
    if (next < 0 || next >= state.totalPages)
        return;
    updateState(parsed.token, { page: next });
    const render = await buildTextList({ ...state, page: next }, parsed.token);
    await interaction.update({ embeds: [render.embed], components: render.components });
}
/**
 * Handles a text pick from the list's select menu.
 *
 * @param interaction the select interaction
 */
export async function handleListSelect(interaction) {
    const token = interaction.customId.slice(LIST_SELECT_PREFIX.length + 1);
    const state = getState(token);
    if (!state || state.ownerId !== interaction.user.id) {
        await interaction.reply({ content: "That message is not yours to control.", ephemeral: true });
        return;
    }
    const textId = interaction.values[0];
    const text = await resolvePageData("text", "texts/:id", { id: textId });
    if (!text.id) {
        await interaction.reply({ content: "That text could not be loaded.", ephemeral: true });
        return;
    }
    const viewer = openViewer(text, interaction.user.id);
    await interaction.reply({
        embeds: [viewerEmbed(viewer.state)],
        components: [viewerRow(viewer.token, 0, viewer.state.pages.length)],
        ephemeral: true,
    });
}
/**
 * Whether the custom id belongs to the text list.
 *
 * @param customId the component custom id
 */
export function isTextListId(customId) {
    return customId.startsWith(LIST_PREFIX);
}
/**
 * Whether the custom id belongs to the text list select.
 *
 * @param customId the component custom id
 */
export function isTextListSelectId(customId) {
    return customId.startsWith(LIST_SELECT_PREFIX);
}
