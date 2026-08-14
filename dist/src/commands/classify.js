import { SlashCommandBuilder } from "discord.js";
import { buildClassifyEmbed } from "~/components/classify-embed.js";
import { classifyText } from "~/utils/api.js";
import { sendable } from "~/utils/sendable.js";
/**
 * Predicts the CEFR level of a text.
 *
 * @param text the text to classify
 * @return the assessment, or null when the service is unavailable
 */
async function runFor(text) {
    const result = await classifyText(text);
    return result.success ? (result.data?.hadesQueries.classifyTextLevel ?? null) : null;
}
/**
 * Predict the CEFR level of a text.
 */
const command = {
    name: "classify",
    aliases: ["level", "cefr"],
    description: "Predict the CEFR level of a text",
    data: new SlashCommandBuilder()
        .setName("classify")
        .setDescription("Predict the CEFR level of a text")
        .addStringOption((option) => option.setName("text").setDescription("The text to classify").setRequired(true)),
    async messageExecute(message, args) {
        const channel = message.channel;
        if (!sendable(channel))
            return;
        const text = args.join(" ");
        if (!text) {
            await message.reply("Usage: `ns classify <text>`");
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
            await interaction.editReply({ content: "The CEFR classifier is unavailable." });
            return;
        }
        await interaction.editReply({ embeds: [buildClassifyEmbed(assessment)] });
    },
};
export default command;
