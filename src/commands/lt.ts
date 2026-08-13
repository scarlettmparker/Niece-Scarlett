import { SlashCommandBuilder } from "discord.js";
import type { APIEmbed } from "discord.js";
import type { LanguageTransferFaq } from "~/types/faq.js";
import { EmbedMessage } from "~/components/embed.js";
import type { Command } from "~/types/command.js";
import { bullet, link } from "~/utils/markdown.js";
import { resolvePageData } from "~/utils/page-data.js";
import { sendable } from "~/utils/sendable.js";

const FALLBACK_LANGUAGE = "en";

/**
 * Fetches the FAQ for a language, falling back to English when missing.
 *
 * @param language the language code
 * @return the FAQ values, or null when not configured
 */
async function faqFor(language: string): Promise<LanguageTransferFaq | null> {
  const faq = await resolvePageData<LanguageTransferFaq>("faq", "language-transfer", {
    language,
  });
  if (faq && faq.title) return faq;
  if (language !== FALLBACK_LANGUAGE) {
    return resolvePageData<LanguageTransferFaq>("faq", "language-transfer", {
      language: FALLBACK_LANGUAGE,
    });
  }
  return null;
}

/**
 * Renders the FAQ embed from its property-set values.
 *
 * @param faq the FAQ values
 */
export function faqEmbed(faq: LanguageTransferFaq): APIEmbed {
  const intro = faq.intro ?? "";
  const bulletsHeader = faq.bulletsHeader ? `\n\n${faq.bulletsHeader}` : "";
  const bullets = (faq.bullets ?? [])
    .map((item) => bullet(link(item.label, item.url)))
    .join("\n");
  const blurb = faq.outro?.blurb ? `\n\n${faq.outro.blurb}` : "";
  const resources =
    faq.outro?.resources && faq.resourcesChannel
      ? `\n\n${faq.outro.resources} ${link(
          faq.outro.resourcesLink ?? faq.outro.resources,
          faq.resourcesChannel
        )}${faq.outro.resourcesContinued ?? ""}`
      : "";

  return new EmbedMessage()
    .setTitle(faq.title ?? "Language Transfer")
    .setBody(`${intro}${bulletsHeader}\n\n${bullets}${blurb}${resources}`)
    .setFooter(faq.footer ?? "")
    .build();
}

/**
 * Explain language transfer.
 */
const command: Command = {
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
    .addStringOption((option) =>
      option
        .setName("language")
        .setDescription("FAQ language")
        .addChoices(
          { name: "English", value: "en" },
          { name: "Ελληνικά", value: "el" }
        )
    ),
  async messageExecute(message, args) {
    const channel = message.channel;
    if (!sendable(channel)) return;

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
