import {
  ActionRowBuilder,
  type ButtonInteraction,
  type Message,
  type MessageActionRowComponentBuilder,
} from "discord.js";
import type { APIEmbed } from "discord.js";
import type { ListAnnotationsQuery } from "~/generated/graphql.js";
import { EmbedMessage } from "~/components/embed.js";
import { pageNavRow } from "~/components/pagination-row.js";
import {
  getState,
  setState,
  updateState,
} from "~/components/interaction-state.js";
import { resolvePageData } from "~/utils/page-data.js";
import { sendable } from "~/utils/sendable.js";

const PAGE_PREFIX = "ns:ann";
const PAGE_SIZE = 10;

type AnnotationItem = NonNullable<
  NonNullable<ListAnnotationsQuery["hadesQueries"]>["annotations"]
>["items"][number];

type AnnotationListState = {
  ownerId: string;
  textId: string;
  textTitle: string;
  spec: { page: number; filters: unknown[]; sort?: unknown; search?: string };
  totalPages: number;
  includeHidden: boolean;
};

function authorName(a: AnnotationItem): string {
  return a.authorProfile?.globalName ?? a.authorProfile?.discordUsername ?? "Unknown";
}

function truncate(body: string, max: number): string {
  return body.length > max ? body.slice(0, max) + "..." : body;
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString();
}

function buildAnnotationEmbed(
  state: AnnotationListState,
  items: AnnotationItem[],
): APIEmbed {
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

function buildPageNav(
  token: string,
  page: number,
  totalPages: number,
): ActionRowBuilder<MessageActionRowComponentBuilder> {
  return pageNavRow(PAGE_PREFIX, token, page, totalPages);
}

export function isAnnotationListId(customId: string): boolean {
  return customId.startsWith(PAGE_PREFIX) && !customId.includes(":select");
}

export async function handleAnnotationListPage(interaction: ButtonInteraction) {
  const parts = interaction.customId.split(":");
  const token = parts[2];
  const direction = parts[3] as "prev" | "next";
  const state = getState<AnnotationListState>(token);
  if (!state || state.ownerId !== interaction.user.id) {
    await interaction.reply({ content: "This list has expired.", ephemeral: true });
    return;
  }
  const nextPage = direction === "next" ? state.spec.page + 1 : state.spec.page - 1;
  if (nextPage < 0 || nextPage >= state.totalPages) return;

  const newSpec = { ...state.spec, page: nextPage };
  updateState(token, { spec: newSpec });

  await interaction.deferUpdate();
  const result = await resolvePageData<{
    items: AnnotationItem[];
    pageInfo: { totalPages: number };
  }>("annotations", "annotations", {
    textId: state.textId,
    spec: newSpec,
    includeHidden: state.includeHidden ? "true" : "false",
  });
  const embed = buildAnnotationEmbed(
    { ...state, spec: newSpec, totalPages: result.pageInfo.totalPages },
    result.items,
  );
  await interaction.editReply({
    embeds: [embed],
    components: [buildPageNav(token, nextPage, result.pageInfo.totalPages)],
  });
}

export async function showAnnotationListMessage(
  message: Message,
  textId: string,
  textTitle: string,
  spec: AnnotationListState["spec"],
  includeHidden: boolean,
) {
  const channel = message.channel;
  if (!sendable(channel)) return;

  const result = await resolvePageData<{
    items: AnnotationItem[];
    pageInfo: { totalPages: number };
  }>("annotations", "annotations", {
    textId,
    spec,
    includeHidden: includeHidden ? "true" : "false",
  });

  const state: AnnotationListState = {
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

export async function showAnnotationListDeferred(
  interaction: { editReply: (options: string | import("discord.js").InteractionEditReplyOptions) => Promise<unknown>; user: { id: string } },
  textId: string,
  textTitle: string,
  spec: AnnotationListState["spec"],
  includeHidden: boolean,
) {
  const result = await resolvePageData<{
    items: AnnotationItem[];
    pageInfo: { totalPages: number };
  }>("annotations", "annotations", {
    textId,
    spec,
    includeHidden: includeHidden ? "true" : "false",
  });

  const state: AnnotationListState = {
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
