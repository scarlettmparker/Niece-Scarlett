import { SlashCommandBuilder } from "discord.js";
import { CefrLevel } from "~/generated/graphql.js";
import { showTextList, showTextListMessage } from "~/components/text-list.js";
import type { Command } from "~/types/command.js";

const LEVEL_CHOICES = Object.values(CefrLevel).map((level) => ({
  name: level,
  value: level,
}));

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
  async messageExecute(message, args) {
    await showTextListMessage(message, args.join(" "));
  },
  async interactionExecute(interaction) {
    const query = interaction.options.getString("query") ?? undefined;
    const level = interaction.options.getString("level") ?? undefined;
    await showTextList(interaction, query, level);
  },
};

export default command;
