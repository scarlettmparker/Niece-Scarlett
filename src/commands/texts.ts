import { SlashCommandBuilder } from "discord.js";
import { CefrLevel } from "~/generated/graphql.js";
import { showTextList, showTextListMessage } from "~/components/text-list.js";
import { getIntent } from "~/utils/intents.js";
import { parseQuerySpec } from "~/utils/query-parser.js";
import type { QueryFilter, QuerySpec } from "~/types/query.js";
import type { Command } from "~/types/command.js";

const LEVEL_CHOICES = Object.values(CefrLevel).map((level) => ({
  name: level,
  value: level,
}));

function fallbackSpec(text: string): QuerySpec {
  return {
    page: 0,
    filters: text
      ? [{ field: "title", operator: "MATCHES", value: text }]
      : [],
    search: text || undefined,
  };
}

/**
 * List reader texts.
 */
const command: Command = {
  name: "texts",
  description: "List reader texts",
  data: new SlashCommandBuilder()
    .setName("texts")
    .setDescription("List reader texts")
    .addStringOption((option) =>
      option.setName("query").setDescription("Search by title")
    )
    .addStringOption((option) =>
      option
        .setName("level")
        .setDescription("CEFR level")
        .addChoices(...LEVEL_CHOICES)
    ),
  async messageExecute(message, args, intent) {
    const text = args.join(" ").trim();
    const resolved = intent ?? (await getIntent("texts"));
    const spec: QuerySpec = resolved?.query
      ? parseQuerySpec(text, resolved.query, resolved.words ?? [])
      : fallbackSpec(text);
    await showTextListMessage(message, spec);
  },
  async interactionExecute(interaction) {
    const query = interaction.options.getString("query") ?? undefined;
    const level = interaction.options.getString("level") ?? undefined;
    const filters: QueryFilter[] = [];
    if (query) {
      filters.push({ field: "title", operator: "MATCHES", value: query });
    }
    if (level) {
      filters.push({ field: "level", operator: "IN", value: level });
    }
    await showTextList(interaction, { page: 0, filters, search: query });
  },
};

export default command;
