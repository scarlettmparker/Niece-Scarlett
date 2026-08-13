import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  type Message,
} from "discord.js";
import type { PagedReaderTexts, ReaderText } from "~/generated/graphql.js";
import {
  showTextListDeferred,
  showTextListMessage,
} from "~/components/text-list.js";
import { openViewer, viewerEmbed, viewerRow } from "~/components/text-viewer.js";
import type { Command } from "~/types/command.js";
import { resolvePageData } from "~/utils/page-data.js";
import { sendable } from "~/utils/sendable.js";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type ResolveResult = ReaderText | null | "multiple";

/**
 * Resolves a term to a text, searching by title when it is not an id.
 *
 * @param term the id or title search
 * @return the matching text, or "multiple" when the search is ambiguous
 */
async function resolveText(term: string): Promise<ResolveResult> {
  if (UUID_REGEX.test(term)) {
    const text = await resolvePageData<ReaderText>("text", "texts/:id", { id: term });
    if (text.id) return text;
    return null;
  }

  const result = await resolvePageData<PagedReaderTexts>("texts", "texts", {
    query: term,
    page: 0,
  });
  if (result.items.length > 1) return "multiple";
  if (result.items.length === 1) return result.items[0];
  return null;
}

async function openForInteraction(
  interaction: ChatInputCommandInteraction,
  term: string
): Promise<void> {
  await interaction.deferReply({ ephemeral: true });

  const resolved = await resolveText(term);
  if (resolved === "multiple") {
    await showTextListDeferred(interaction, term);
    return;
  }
  if (!resolved) {
    await interaction.editReply({ content: "No text found." });
    return;
  }

  const viewer = openViewer(resolved, interaction.user.id);
  await interaction.editReply({
    embeds: [viewerEmbed(viewer.state)],
    components: [viewerRow(viewer.token, 0, viewer.state.pages.length)],
  });
}

async function openForMessage(message: Message, term: string): Promise<void> {
  const channel = message.channel;
  if (!sendable(channel)) return;

  const resolved = await resolveText(term);
  if (resolved === "multiple") {
    await showTextListMessage(message, term);
    return;
  }
  if (!resolved) {
    await message.reply("No text found.");
    return;
  }

  const viewer = openViewer(resolved, message.author.id);
  await channel.send({
    embeds: [viewerEmbed(viewer.state)],
    components: [viewerRow(viewer.token, 0, viewer.state.pages.length)],
  });
}

/**
 * Locate and read a text.
 */
const command: Command = {
  name: "text",
  description: "Locate and read a text",
  data: new SlashCommandBuilder()
    .setName("text")
    .setDescription("Locate and read a text")
    .addStringOption((option) =>
      option
        .setName("text")
        .setDescription("Text id or title search")
        .setRequired(true)
    ),
  async messageExecute(message, args) {
    const term = args.join(" ");
    if (!term) {
      await message.reply("Usage: `niece scarlett text <title or id>`");
      return;
    }
    await openForMessage(message, term);
  },
  async interactionExecute(interaction) {
    const term = interaction.options.getString("text", true);
    await openForInteraction(interaction, term);
  },
};

export default command;
