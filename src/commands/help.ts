import { SlashCommandBuilder } from "discord.js";
import type { Command } from "~/types/command.js";
import {
  fetchAccessibleCommands,
  fetchBlogPostsByRemoteObjects,
} from "~/utils/api.js";
import { sendable } from "~/utils/sendable.js";
import { loadTranslations } from "~/translations/index.js";
import {
  helpListEmbed,
  helpDetailEmbed,
  type CommandEntry,
} from "~/components/help-embed.js";

const OWNER_KEY = "NieceScarlett";
const PROPERTY_SET = "command-intents";

const t = loadTranslations("bot");

/**
 * Fetches the commands the caller may run.
 *
 * @param discordId the Discord user id
 * @return the accessible command entries
 */
async function accessibleCommands(discordId: string): Promise<CommandEntry[]> {
  const result = await fetchAccessibleCommands(discordId, OWNER_KEY, PROPERTY_SET);
  if (!result.success || !result.data?.gaiaQueries) return [];
  return result.data.gaiaQueries.accessibleCommandIntents.map((e) => ({
    entryName: e.entryName,
    values: e.values as Record<string, unknown>,
  }));
}

/**
 * Attempts to load a BOT_HELP blog post for the command.
 *
 * @param commandName the command name to look up
 * @return the post content, or undefined when absent
 */
async function helpPost(
  commandName: string,
): Promise<string | undefined> {
  const remoteObject = `niece-scarlett:command_help:${commandName}`;
  const result = await fetchBlogPostsByRemoteObjects([remoteObject]);
  if (!result.success || !result.data?.blogQueries) return undefined;
  const posts = result.data.blogQueries.listByRemoteObjects;
  if (!posts?.length) return undefined;
  return posts[0]?.content ?? undefined;
}

const command: Command = {
  name: "help",
  description: t("help.description"),
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription(t("help.description"))
    .addStringOption((option) =>
      option
        .setName("command")
        .setDescription(t("help.command-option"))
    ),
  async messageExecute(message, args) {
    if (!sendable(message.channel)) return;
    const commands = await accessibleCommands(message.author.id);
    if (!args.length) {
      await message.channel.send({ embeds: [helpListEmbed(commands)] });
      return;
    }
    const name = args[0].toLowerCase();
    const entry = commands.find((c) => c.entryName === name);
    if (!entry) {
      const available = commands.map((c) => c.entryName).join(", ");
      await message.reply(t("help.unknown").replace("{commands}", available));
      return;
    }
    const helpContent = await helpPost(name);
    await message.channel.send({
      embeds: [helpDetailEmbed(entry, helpContent)],
    });
  },
  async interactionExecute(interaction) {
    const name = interaction.options.getString("command")?.toLowerCase();
    const commands = await accessibleCommands(interaction.user.id);
    if (!name) {
      await interaction.reply({ embeds: [helpListEmbed(commands)] });
      return;
    }
    const entry = commands.find((c) => c.entryName === name);
    if (!entry) {
      const available = commands.map((c) => c.entryName).join(", ");
      await interaction.reply({
        content: t("help.unknown").replace("{commands}", available),
        ephemeral: true,
      });
      return;
    }
    const helpContent = await helpPost(name);
    await interaction.reply({
      embeds: [helpDetailEmbed(entry, helpContent)],
    });
  },
};

export default command;
