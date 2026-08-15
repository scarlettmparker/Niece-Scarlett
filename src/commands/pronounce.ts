import { SlashCommandBuilder } from "discord.js";
import { EmbedMessage } from "~/components/embed.js";
import {
  fetchAudio,
  fetchWordPage,
  greekAudioUrl,
  wordPageUrl,
} from "~/utils/forvo.js";
import { sendable } from "~/utils/sendable.js";
import type { Command } from "~/types/command.js";

/**
 * Builds the embed that links back to the word's Forvo page.
 *
 * @param word the pronounced word
 */
function pronounceEmbed(word: string) {
  return new EmbedMessage()
    .setBody(`[View on Forvo](${wordPageUrl(word)})`)
    .build();
}

/**
 * Names the audio attachment after its word, keeping it filesystem-safe.
 *
 * @param word the pronounced word
 */
function audioName(word: string): string {
  const safe = word.replace(/[^\p{L}\p{N}]+/gu, "_").replace(/^_+|_+$/g, "");
  return `${safe || "word"}.mp3`;
}

/**
 * Pronounce a word from Forvo.
 */
const command: Command = {
  name: "pronounce",
  description: "Play the Greek pronunciation of a word",
  data: new SlashCommandBuilder()
    .setName("pronounce")
    .setDescription("Play the Greek pronunciation of a word")
    .addStringOption((option) =>
      option.setName("word").setDescription("The word to pronounce").setRequired(true)
    ),
  async messageExecute(message, args) {
    const word = args.join(" ").trim();
    if (!word) {
      await message.reply("Usage: `ns pronounce <word>`");
      return;
    }
    const channel = message.channel;
    if (!sendable(channel)) return;

    const html = await fetchWordPage(word);
    const audioUrl = html ? greekAudioUrl(html) : null;
    if (!audioUrl) {
      await message.reply("That entry does not exist.");
      return;
    }
    const audio = await fetchAudio(audioUrl);
    await channel.send({
      embeds: [pronounceEmbed(word)],
      files: [{ attachment: audio, name: audioName(word) }],
    });
  },
  async interactionExecute(interaction) {
    const word = interaction.options.getString("word", true).trim();
    await interaction.deferReply();

    const html = await fetchWordPage(word);
    const audioUrl = html ? greekAudioUrl(html) : null;
    if (!audioUrl) {
      await interaction.editReply({ content: "That entry does not exist." });
      return;
    }
    const audio = await fetchAudio(audioUrl);
    await interaction.editReply({
      embeds: [pronounceEmbed(word)],
      files: [{ attachment: audio, name: audioName(word) }],
    });
  },
};

export default command;
