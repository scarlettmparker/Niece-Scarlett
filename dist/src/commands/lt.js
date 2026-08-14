import { SlashCommandBuilder } from "discord.js";
import { EmbedMessage } from "~/components/embed.js";
import { resolvePageData } from "~/utils/page-data.js";
import { sendable } from "~/utils/sendable.js";
const FALLBACK_LANGUAGE = "en";
/**
 * Fetches the FAQ for a language, falling back to English when missing.
 *
 * @param language the language code
 * @return the rendered FAQ, or null when not configured
 */
async function faqFor(language) {
    const faq = await resolvePageData("faq", "language-transfer", {
        language,
    });
    if (faq.title)
        return faq;
    if (language !== FALLBACK_LANGUAGE) {
        return resolvePageData("faq", "language-transfer", {
            language: FALLBACK_LANGUAGE,
        });
    }
    return null;
}
/**
 * Renders the resolved FAQ as an embed.
 *
 * @param faq the rendered FAQ
 */
export function faqEmbed(faq) {
    return new EmbedMessage()
        .setTitle(faq.title)
        .setBody(faq.body)
        .setFooter(faq.footer)
        .build();
}
/**
 * Explain language transfer.
 */
const command = {
    name: "lt",
    aliases: [
        "what is lt",
        "language transfer",
        "what is language transfer",
        "explain lt",
        "explain language transfer",
    ],
    description: "Explain language transfer",
    data: new SlashCommandBuilder()
        .setName("lt")
        .setDescription("Explain language transfer")
        .addStringOption((option) => option
        .setName("language")
        .setDescription("FAQ language")
        .addChoices({ name: "English", value: "en" }, { name: "Ελληνικά", value: "el" })),
    async messageExecute(message, args) {
        const channel = message.channel;
        if (!sendable(channel))
            return;
        const faq = await faqFor(args[0] ?? "en");
        if (!faq) {
            await message.reply("The language transfer FAQ is not configured yet.");
            return;
        }
        await channel.send({ embeds: [faqEmbed(faq)] });
    },
    async interactionExecute(interaction) {
        const language = interaction.options.getString("language") ?? "en";
        await interaction.deferReply();
        const faq = await faqFor(language);
        if (!faq) {
            await interaction.editReply({
                content: "The language transfer FAQ is not configured yet.",
            });
            return;
        }
        await interaction.editReply({ embeds: [faqEmbed(faq)] });
    },
};
export default command;
