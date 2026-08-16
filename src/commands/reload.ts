import { SlashCommandBuilder } from "discord.js";
import { flushCommandConfig } from "~/utils/command-config.js";
import type { Command } from "~/types/command.js";

/**
 * Reload runtime command configuration.
 */
const command: Command = {
  name: "reload",
  description: "Flush the cached runtime command config",
  permission: "bot.commands.reload",
  data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("Flush the cached runtime command config"),
  async messageExecute(message) {
    flushCommandConfig();
    await message.reply("Config cache flushed.");
    return true;
  },
  async interactionExecute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    flushCommandConfig();
    await interaction.editReply({ content: "Config cache flushed." });
    return true;
  },
};

export default command;
