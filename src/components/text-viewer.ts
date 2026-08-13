import {
  ButtonInteraction,
  type MessageActionRowComponentBuilder,
  ActionRowBuilder,
} from "discord.js";
import type { APIEmbed } from "discord.js";
import type { ReaderText } from "~/generated/graphql.js";
import { EmbedMessage } from "./embed.js";
import { getState, setState, updateState } from "./interaction-state.js";
import { pageNavRow } from "./pagination-row.js";
import { chunkText } from "~/utils/pagination.js";

export const TEXT_VIEWER_PREFIX = "ns:text";

export interface ViewerState {
  /**
   * The user who may control the viewer.
   */
  ownerId: string;
  /**
   * The id of the text being read.
   */
  textId: string;
  /**
   * The text title, shown on every page.
   */
  title: string;
  /**
   * The text CEFR level, shown in the footer.
   */
  level: string;
  /**
   * The text language, shown in the footer.
   */
  language: string;
  /**
   * The content split into pages.
   */
  pages: string[];
  /**
   * The zero-based current page.
   */
  page: number;
}

export interface OpenViewer {
  /**
   * The token embedded in the viewer's button custom ids.
   */
  token: string;
  /**
   * The stored viewer state.
   */
  state: ViewerState;
}

/**
 * Opens the paginated viewer for a text and stores its state.
 *
 * @param text the text with content loaded
 * @param ownerId the user who may control the viewer
 */
export function openViewer(text: ReaderText, ownerId: string): OpenViewer {
  const state: ViewerState = {
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
export function viewerEmbed(state: ViewerState): APIEmbed {
  return new EmbedMessage()
    .setTitle(state.title)
    .setBody(state.pages[state.page] ?? "")
    .setFooter(
      `${state.language} · ${state.level} · Page ${state.page + 1}/${state.pages.length}`
    )
    .build();
}

/**
 * Builds the prev/next row for the viewer.
 *
 * @param token the viewer token
 * @param page the current page
 * @param total the total number of pages
 */
export function viewerRow(
  token: string,
  page: number,
  total: number
): ActionRowBuilder<MessageActionRowComponentBuilder> {
  return pageNavRow(TEXT_VIEWER_PREFIX, token, page, total);
}

interface ParsedViewer {
  token: string;
  direction: "prev" | "next";
}

/**
 * Reads the token and direction from a viewer button custom id.
 *
 * @param customId the button custom id
 */
export function parseViewerToken(customId: string): ParsedViewer | null {
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
export async function handleViewerButton(interaction: ButtonInteraction): Promise<void> {
  const parsed = parseViewerToken(interaction.customId);
  if (!parsed) return;

  const state = getState<ViewerState>(parsed.token);
  if (!state || state.ownerId !== interaction.user.id) {
    await interaction.reply({ content: "That message is not yours to control.", ephemeral: true });
    return;
  }

  const next = parsed.direction === "prev" ? state.page - 1 : state.page + 1;
  if (next < 0 || next >= state.pages.length) return;

  updateState<ViewerState>(parsed.token, { page: next });
  const updated: ViewerState = { ...state, page: next };
  await interaction.update({
    embeds: [viewerEmbed(updated)],
    components: [viewerRow(parsed.token, next, updated.pages.length)],
  });
}
