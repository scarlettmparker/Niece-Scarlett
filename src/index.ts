import {
  Client,
  Collection,
  GatewayIntentBits,
  type Interaction,
  type Message,
} from "discord.js";
import { botToken } from "~/config.js";
import {
  handleListPage,
  handleListSelect,
  isTextListId,
  isTextListSelectId,
} from "~/components/text-list.js";
import {
  TEXT_VIEWER_PREFIX,
  handleViewerButton,
} from "~/components/text-viewer.js";
import type { ClientType } from "~/types/client.js";
import type { Command } from "~/types/command.js";
import { loadCommands } from "~/utils/load-commands.js";
import { resolveIntent, type CommandIntent } from "~/utils/intents.js";
import { canRun, checkRateLimit } from "~/utils/access.js";
import { resolvePageData } from "~/utils/page-data.js";
import { registerCommands } from "~/utils/register-commands.js";

const PREFIXES = ["niece scarlett", "ns"];

/**
 * Extracts the command content after the first matching prefix.
 *
 * @param content the message content
 * @return the content after the prefix, or null when no prefix matches
 */
function stripPrefix(content: string): string | null {
  const lower = content.toLowerCase();
  for (const prefix of PREFIXES) {
    if (lower.startsWith(prefix)) {
      return content.slice(prefix.length).trim();
    }
  }
  return null;
}

/**
 * Checks a command's rate limit and permission before it runs.
 *
 * @param userId the requesting user's id
 * @param command the command being invoked
 * @param deny how to refuse the invocation
 * @return whether execution may proceed
 */
async function assertCommandAccess(
  userId: string,
  command: Command,
  deny: (content: string) => Promise<unknown>,
): Promise<boolean> {
  if (!command.permission && !command.rateLimit) {
    return true;
  }
  if (command.rateLimit) {
    const result = checkRateLimit(
      `${userId}:${command.name}`,
      command.rateLimit.capacity,
      command.rateLimit.refillPerSecond,
    );
    if (!result.allowed) {
      await deny(`You're going too fast. Try again in ${result.retryAfter}s.`);
      return false;
    }
  }
  if (command.permission && !(await canRun(userId, command.permission))) {
    await deny("You don't have permission to run this command.");
    return false;
  }
  return true;
}

/**
 * Boots the Discord client and logs in.
 */
export async function bootClient(): Promise<void> {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds, // dpp default intents
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent, // dpp i_message_content
      GatewayIntentBits.GuildMembers, // dpp i_guild_member
    ],
  }) as ClientType;

  // Load commands
  const commands = await loadCommands();
  client.commands = new Collection<string, Command>();

  for (const command of commands) {
    // store by name
    client.commands.set(command.name, command);

    // store by aliases
    if (command.aliases) {
      for (const alias of command.aliases) {
        client.commands.set(alias, command);
      }
    }
  }

  /**
   * Bot client ready.
   */
  client.on("clientReady", (c) => {
    console.log(`${c.user.username} is online.`);
    registerCommands(client).catch((err) =>
      console.error("Failed to register slash commands", err),
    );
  });

  /**
   * Handle message replies (commands are from messages).
   */
  client.on("messageCreate", async (message: Message) => {
    // because why would the bot do that
    if (message.author.bot) return;

    const rest = stripPrefix(message.content);
    if (rest === null) return;

    let matched = matchCommand(client.commands, rest);
    if (!matched) {
      matched = await matchIntent(client.commands, rest);
    }
    if (!matched) return; // command isn't real anyway

    try {
      const allowed = await assertCommandAccess(
        message.author.id,
        matched.command,
        (content) => message.reply(content),
      );
      if (allowed) {
        await matched.command.messageExecute(
          message,
          matched.args,
          matched.intent,
        );
      }
    } catch (err) {
      console.error(err);
      await message.reply("There was an error executing this command.");
    }
  });

  /**
   * Handle slash commands and their message components.
   */
  client.on("interactionCreate", async (interaction: Interaction) => {
    try {
      if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (command?.interactionExecute) {
          const allowed = await assertCommandAccess(
            interaction.user.id,
            command,
            (content) => interaction.reply({ content, ephemeral: true }),
          );
          if (allowed) {
            await command.interactionExecute(interaction);
          }
        }
        return;
      }

      if (interaction.isButton()) {
        if (interaction.customId.startsWith(TEXT_VIEWER_PREFIX)) {
          await handleViewerButton(interaction);
        } else if (isTextListId(interaction.customId)) {
          await handleListPage(interaction);
        }
        return;
      }

      if (
        interaction.isStringSelectMenu() &&
        isTextListSelectId(interaction.customId)
      ) {
        await handleListSelect(interaction);
      }
    } catch (err) {
      console.error(err);
      if (interaction.isRepliable()) {
        await interaction
          .reply({
            content: "There was an error executing this command.",
            ephemeral: true,
          })
          .catch(() => {});
      }
    }
  });

  await client.login(botToken);
}

interface MatchedCommand {
  command: Command;
  args: string[];
  intent?: CommandIntent;
}

/**
 * Resolves the command and its arguments from a prefixed message.
 *
 * @param commands the command registry keyed by name and alias
 * @param content the message content after the prefix
 */
function matchCommand(
  commands: Collection<string, Command>,
  content: string,
): MatchedCommand | null {
  const lower = content.toLowerCase();
  let best: { command: Command; key: string } | null = null;

  for (const [key, command] of commands) {
    const keyLower = key.toLowerCase();
    if (lower === keyLower || lower.startsWith(keyLower + " ")) {
      if (!best || keyLower.length > best.key.length) {
        best = { command, key: keyLower };
      }
    }
  }

  if (!best) return null;
  const rest = content.slice(best.key.length).trim();
  return {
    command: best.command,
    args: rest.length > 0 ? rest.split(/\s+/) : [],
  };
}

/**
 * Resolves a prefixed message to a command via its intent word cloud.
 *
 * @param commands the command registry keyed by name and alias
 * @param content the message content after the prefix
 * @return the matched command, or null when no intent matches
 */
async function matchIntent(
  commands: Collection<string, Command>,
  content: string,
): Promise<MatchedCommand | null> {
  try {
    const intents = await resolvePageData<CommandIntent[]>(
      "intents",
      "command-intents",
    );
    const intent = resolveIntent(content, intents);
    if (!intent) {
      return null;
    }
    const command = commands.get(intent.command);
    if (!command) {
      return null;
    }
    return { command, args: [content], intent };
  } catch {
    return null;
  }
}
