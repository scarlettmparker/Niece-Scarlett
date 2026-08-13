import {
  ActionRowBuilder,
  ButtonInteraction,
  type ChatInputCommandInteraction,
  type Message,
  type MessageActionRowComponentBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
} from "discord.js";
import type { APIEmbed } from "discord.js";
import type { PagedReaderTexts, ReaderText } from "~/generated/graphql.js";
import { EmbedMessage } from "./embed.js";
import { getState, setState, updateState } from "./interaction-state.js";
import { pageNavRow } from "./pagination-row.js";
import { openViewer, viewerEmbed, viewerRow } from "./text-viewer.js";
import { resolvePageData } from "~/utils/page-data.js";
import { sendable } from "~/utils/sendable.js";

const LIST_PREFIX = "ns:list";
const LIST_SELECT_PREFIX = "ns:list:select";
const MAX_OPTIONS = 25;

export interface TextListState {
  /**
   * The user who may control the list.
   */
  ownerId: string;
  /**
   * The title search, when filtering.
   */
  query?: string;
  /**
   * The CEFR level filter, when set.
   */
  level?: string;
  /**
   * The zero-based current page.
   */
  page: number;
  /**
   * The total number of pages, refreshed on each fetch.
   */
  totalPages: number;
}

interface TextListRender {
  /**
   * The list embed.
   */
  embed: APIEmbed;
  /**
   * The select and pagination rows.
   */
  components: ActionRowBuilder<MessageActionRowComponentBuilder>[];
}

/**
 * Shows the interactive text list to a slash command user (ephemeral).
 *
 * @param interaction the command interaction
 * @param query optional title search
 * @param level optional CEFR level
 */
export async function showTextList(
  interaction: ChatInputCommandInteraction,
  query?: string,
  level?: string
): Promise<void> {
  await interaction.deferReply({ ephemeral: true });
  await sendTextList(interaction, query, level);
}

/**
 * Renders the list into an already-deferred interaction reply.
 *
 * @param interaction the command interaction
 * @param query optional title search
 * @param level optional CEFR level
 */
export async function showTextListDeferred(
  interaction: ChatInputCommandInteraction,
  query?: string,
  level?: string
): Promise<void> {
  await sendTextList(interaction, query, level);
}

async function sendTextList(
  interaction: ChatInputCommandInteraction,
  query?: string,
  level?: string
): Promise<void> {
  const state: TextListState = {
    ownerId: interaction.user.id,
    query,
    level,
    page: 0,
    totalPages: 1,
  };
  const token = setState(state);
  const render = await buildTextList(state, token);
  await interaction.editReply({ embeds: [render.embed], components: render.components });
}

/**
 * Shows the interactive text list in a message's channel.
 *
 * @param message the message that invoked the command
 * @param query optional title search
 * @param level optional CEFR level
 */
export async function showTextListMessage(
  message: Message,
  query?: string,
  level?: string
): Promise<void> {
  if (!sendable(message.channel)) return;

  const state: TextListState = {
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

async function buildTextList(state: TextListState, token: string): Promise<TextListRender> {
  const result = await resolvePageData<PagedReaderTexts>("texts", "texts", {
    query: state.query,
    level: state.level,
    page: state.page,
  });
  const texts = result.items;
  const totalPages = Math.max(result.pageInfo.totalPages, 1);
  const offset = state.page * Math.max(result.pageInfo.size, 1);
  updateState<TextListState>(token, { totalPages });

  const embed = new EmbedMessage()
    .setTitle(state.query ? `Texts matching "${state.query}"` : "Texts")
    .setBody(
      texts.length > 0
        ? texts
            .map(
              (text, index) =>
                `${offset + index + 1}. **${text.title}** — ${text.level} · ${text.language}`
            )
            .join("\n")
        : "No texts found."
    )
    .setFooter(`Page ${state.page + 1}/${totalPages}`)
    .build();

  const components: ActionRowBuilder<MessageActionRowComponentBuilder>[] = [];
  if (texts.length > 0) {
    components.push(selectRow(token, texts));
  }
  components.push(pageRow(token, state.page, totalPages));
  return { embed, components };
}

function selectRow(
  token: string,
  texts: ReaderText[]
): ActionRowBuilder<MessageActionRowComponentBuilder> {
  return new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId(`${LIST_SELECT_PREFIX}:${token}`)
      .setPlaceholder("Choose a text to read")
      .addOptions(
        texts.slice(0, MAX_OPTIONS).map((text) => ({
          label: text.title.slice(0, 100),
          value: text.id,
          description: `${text.level} · ${text.language}`,
        }))
      )
  );
}

function pageRow(
  token: string,
  page: number,
  totalPages: number
): ActionRowBuilder<MessageActionRowComponentBuilder> {
  return pageNavRow(LIST_PREFIX, token, page, totalPages);
}

interface ParsedList {
  /**
   * The list state token.
   */
  token: string;
  /**
   * The requested page direction.
   */
  direction: "prev" | "next";
}

/**
 * Reads the token and direction from a list page-button custom id.
 *
 * @param customId the button custom id
 */
export function parseListToken(customId: string): ParsedList | null {
  if (!customId.startsWith(`${LIST_PREFIX}:`)) {
    return null;
  }
  const parts = customId.slice(`${LIST_PREFIX}:`.length).split(":");
  if (parts.length !== 2) {
    return null;
  }
  if (parts[1] !== "prev" && parts[1] !== "next") {
    return null;
  }
  return { token: parts[0], direction: parts[1] };
}

/**
 * Handles a text list prev/next button press.
 *
 * @param interaction the button interaction
 */
export async function handleListPage(interaction: ButtonInteraction): Promise<void> {
  const parsed = parseListToken(interaction.customId);
  if (!parsed) return;

  const state = getState<TextListState>(parsed.token);
  if (!state || state.ownerId !== interaction.user.id) {
    await interaction.reply({ content: "That message is not yours to control.", ephemeral: true });
    return;
  }

  const next = parsed.direction === "prev" ? state.page - 1 : state.page + 1;
  if (next < 0 || next >= state.totalPages) return;

  await interaction.deferUpdate();
  updateState<TextListState>(parsed.token, { page: next });
  const render = await buildTextList({ ...state, page: next }, parsed.token);
  await interaction.editReply({ embeds: [render.embed], components: render.components });
}

/**
 * Handles a text pick from the list's select menu.
 *
 * @param interaction the select interaction
 */
export async function handleListSelect(interaction: StringSelectMenuInteraction): Promise<void> {
  const token = interaction.customId.slice(LIST_SELECT_PREFIX.length + 1);
  const state = getState<TextListState>(token);
  if (!state || state.ownerId !== interaction.user.id) {
    await interaction.reply({ content: "That message is not yours to control.", ephemeral: true });
    return;
  }

  const textId = interaction.values[0];
  await interaction.deferReply({ ephemeral: true });
  const text = await resolvePageData<ReaderText>("text", "texts/:id", { id: textId });
  if (!text.id) {
    await interaction.editReply({ content: "That text could not be loaded." });
    return;
  }

  const viewer = openViewer(text, interaction.user.id);
  await interaction.editReply({
    embeds: [viewerEmbed(viewer.state)],
    components: [viewerRow(viewer.token, 0, viewer.state.pages.length)],
  });
}

/**
 * Whether the custom id belongs to the text list.
 *
 * @param customId the component custom id
 */
export function isTextListId(customId: string): boolean {
  return customId.startsWith(LIST_PREFIX);
}

/**
 * Whether the custom id belongs to the text list select.
 *
 * @param customId the component custom id
 */
export function isTextListSelectId(customId: string): boolean {
  return customId.startsWith(LIST_SELECT_PREFIX);
}
