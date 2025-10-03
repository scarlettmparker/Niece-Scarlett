import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { loadTranslations } from "~/translations";
import { Command } from "~/types/command";

/**
 * Hello world command.
 * Translation function tester.
 */
const command: Command = {
  data: new SlashCommandBuilder()
    .setName("hello")
    .setDescription("Replies with a hello world message"),
  async execute(interaction: ChatInputCommandInteraction) {
    const t = loadTranslations("hello-world");
    await interaction.reply(t("message"));
  },
};

export default command;
