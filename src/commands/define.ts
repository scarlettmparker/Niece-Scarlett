import { SlashCommandBuilder } from "discord.js";
import { EmbedMessage } from "~/components/embed.js";
import { WordScope, type DefineWordQuery } from "~/generated/graphql.js";
import { fetchDefineWord } from "~/utils/api.js";
import { STOP_WORDS } from "~/utils/intents.js";
import { sendable } from "~/utils/sendable.js";
import type { Command } from "~/types/command.js";

type DefinedWord = NonNullable<DefineWordQuery["hadesQueries"]["defineWord"]>;

/**
 * Parses the scope phrases of a define utterance into scope enums.
 *
 * @param text the scope text after "with"
 * @return the scopes in canonical order
 */
export function parseDefineScope(text: string): WordScope[] {
  const lower = text.toLowerCase();
  const scopes: WordScope[] = [];
  if (/(all translations|every translation|\ball\b)/.test(lower)) {
    scopes.push(WordScope.AllTranslations);
  }
  if (/examples?/.test(lower)) {
    scopes.push(WordScope.Examples);
  }
  if (/compounds?/.test(lower)) {
    scopes.push(WordScope.Compounds);
  }
  if (/related/.test(lower)) {
    scopes.push(WordScope.RelatedWords);
  }
  return scopes;
}

/**
 * Splits a define invocation into its word and its "with" scope text.
 *
 * @param args the command arguments
 * @param excludeWords the intent trigger words to drop from the word
 * @return the word and the remaining scope text
 */
export function splitDefineArgs(
  args: string[],
  excludeWords: string[] = [],
): { word: string; scopeText: string } {
  const tokens = args.join(" ").split(/\s+/);
  const withIndex = tokens.findIndex((token) => token.toLowerCase() === "with");
  const head = withIndex === -1 ? tokens : tokens.slice(0, withIndex);
  const tail = withIndex === -1 ? [] : tokens.slice(withIndex + 1);
  const excluded = new Set([...excludeWords, ...STOP_WORDS]);
  const word = head
    .filter((token) => !excluded.has(token.toLowerCase()))
    .join(" ")
    .trim();
  return { word, scopeText: tail.join(" ") };
}

/**
 * Builds the embed describing a defined word.
 *
 * @param def the defined word
 */
function defineEmbed(def: DefinedWord) {
  const lines: string[] = [];
  for (const entry of def.entries) {
    const sense = entry.sense ? ` - (${entry.sense})` : "";
    lines.push(`**${entry.term}** *(${entry.wordType})*${sense}`);
    for (const translation of entry.translations) {
      const notes = translation.usageNotes.map((note) => `(${note})`).join(" ");
      const type = translation.wordType ? ` *(${translation.wordType})*` : "";
      lines.push(`- ${notes} **${translation.term}**${type}`);
    }
    for (const example of entry.examples) {
      lines.push(`> ${example}`);
    }
  }
  if (def.compounds.length > 0) {
    lines.push("", "**Σύνθετοι τύποι**");
    for (const compound of def.compounds) {
      const translations = compound.translations.map((t) => t.term).join(", ");
      lines.push(
        `- ${compound.term} *(${compound.wordType})* -> ${translations}`,
      );
    }
  }
  if (def.relatedWords.length > 0) {
    lines.push(
      "",
      `**Related**: ${def.relatedWords.map((w) => w.term).join(", ")}`,
    );
  }
  return new EmbedMessage()
    .setTitle(def.term)
    .setBody(lines.join("\n"))
    .build();
}

/**
 * Define a Greek word from WordReference.
 */
const command: Command = {
  name: "define",
  aliases: ["meaning", "dictionary"],
  description: "Define a Greek word from WordReference",
  data: new SlashCommandBuilder()
    .setName("define")
    .setDescription("Define a Greek word from WordReference")
    .addStringOption((option) =>
      option
        .setName("word")
        .setDescription("The word to define")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("scope")
        .setDescription(
          "Comma-separated: examples, all translations, compounds, related",
        ),
    ),
  async messageExecute(message, args, intent) {
    const { word, scopeText } = splitDefineArgs(args, intent?.words ?? []);
    if (!word) {
      await message.reply(
        "Usage: `ns define <word> [with examples, all translations, compounds, related]`",
      );
      return false;
    }
    const channel = message.channel;
    if (!sendable(channel)) return false;

    const scope = parseDefineScope(scopeText);
    const result = await fetchDefineWord(word, scope);
    if (!result.success) {
      await message.reply("That entry does not exist.");
      return false;
    }
    const def = result.data?.hadesQueries.defineWord;
    if (!def || (def.entries.length === 0 && def.compounds.length === 0)) {
      await message.reply("That entry does not exist.");
      return true;
    }
    await channel.send({ embeds: [defineEmbed(def)] });
    return true;
  },
  async interactionExecute(interaction) {
    const word = interaction.options.getString("word", true).trim();
    const scopeText = interaction.options.getString("scope") ?? "";
    await interaction.deferReply();

    const scope = parseDefineScope(scopeText);
    const result = await fetchDefineWord(word, scope);
    if (!result.success) {
      await interaction.editReply({ content: "That entry does not exist." });
      return false;
    }
    const def = result.data?.hadesQueries.defineWord;
    if (!def || (def.entries.length === 0 && def.compounds.length === 0)) {
      await interaction.editReply({ content: "That entry does not exist." });
      return true;
    }
    await interaction.editReply({ embeds: [defineEmbed(def)] });
    return true;
  },
};

export default command;
