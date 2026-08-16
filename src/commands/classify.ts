import { SlashCommandBuilder } from "discord.js";
import type { Message } from "discord.js";
import type { TextLevelAssessment } from "~/generated/graphql.js";
import { buildClassifyEmbed } from "~/components/classify-embed.js";
import type { Command } from "~/types/command.js";
import { classifyText } from "~/utils/api.js";
import { sendable } from "~/utils/sendable.js";

/**
 * Predicts the CEFR level of a text.
 *
 * @param text the text to classify
 * @return the assessment, or null when the service is unavailable
 */
async function runFor(text: string): Promise<TextLevelAssessment | null> {
  const result = await classifyText(text);
  return result.success
    ? (result.data?.hadesQueries.classifyTextLevel ?? null)
    : null;
}

/**
 * Decides what to classify: inline arguments, a replied message, or nothing.
 *
 * @param args the command arguments
 * @param hasReply whether the message replies to another message
 */
export function classifyTarget(
  args: string[],
  hasReply: boolean,
): "inline" | "reply" | null {
  if (args.length > 0) {
    return "inline";
  }
  if (hasReply) {
    return "reply";
  }
  return null;
}

/**
 * Fetches the content of the message being replied to.
 *
 * @param message the command message
 * @return the replied message content, or null when unavailable
 */
async function repliedContent(message: Message): Promise<string | null> {
  const referenceId = message.reference?.messageId;
  if (!referenceId) {
    return null;
  }
  const channel = message.channel;
  if (!channel || !("messages" in channel)) {
    return null;
  }
  try {
    const replied = await channel.messages.fetch(referenceId);
    return replied.content || null;
  } catch {
    return null;
  }
}

/**
 * Predict the CEFR level of a text.
 */
const command: Command = {
  name: "classify",
  aliases: ["level", "cefr"],
  description: "Predict the CEFR level of a text",
  data: new SlashCommandBuilder()
    .setName("classify")
    .setDescription("Predict the CEFR level of a text")
    .addStringOption((option) =>
      option
        .setName("text")
        .setDescription("The text to classify")
        .setRequired(true),
    ),
  async messageExecute(message, args) {
    const channel = message.channel;
    if (!sendable(channel)) return;

    const target = classifyTarget(args, message.reference != null);
    if (target === null) {
      await message.reply(
        "Reply to a message with `ns classify`, or use `ns classify <text>`.",
      );
      return;
    }
    const text =
      target === "inline" ? args.join(" ") : await repliedContent(message);
    if (!text) {
      await message.reply("That message has no text to classify.");
      return;
    }

    const assessment = await runFor(text);
    if (!assessment) {
      await message.reply("The CEFR classifier is unavailable.");
      return;
    }
    await channel.send({ embeds: [buildClassifyEmbed(assessment)] });
  },
  async interactionExecute(interaction) {
    const text = interaction.options.getString("text", true);
    await interaction.deferReply({ ephemeral: true });

    const assessment = await runFor(text);
    if (!assessment) {
      await interaction.editReply({
        content: "The CEFR classifier is unavailable.",
      });
      return;
    }
    await interaction.editReply({ embeds: [buildClassifyEmbed(assessment)] });
  },
};

export default command;
