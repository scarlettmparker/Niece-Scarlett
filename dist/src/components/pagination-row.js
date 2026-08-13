import { ActionRowBuilder, ButtonBuilder, ButtonStyle, } from "discord.js";
/**
 * Builds a prev/next navigation row for a paginated component.
 *
 * @param prefix the custom-id namespace
 * @param token the interaction state token
 * @param page the current page
 * @param total the total number of pages
 */
export function pageNavRow(prefix, token, page, total) {
    return new ActionRowBuilder().addComponents(new ButtonBuilder()
        .setCustomId(`${prefix}:${token}:prev`)
        .setLabel("Previous")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(page === 0), new ButtonBuilder()
        .setCustomId(`${prefix}:${token}:next`)
        .setLabel("Next")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(page >= total - 1));
}
