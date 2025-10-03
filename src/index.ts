import "dotenv/config";
import { Client, Collection, GatewayIntentBits, Message } from "discord.js";
import type { ClientType } from "./types/client";
import { loadCommands } from "./utils/load-commands";
import type { Command } from "./types/command";

const PREFIX = "niece scarlett";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, // dpp default intents
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent, // dpp i_message_content
    GatewayIntentBits.GuildMembers, // dpp i_guild_member
  ],
}) as ClientType;

// Load commands
// discord.js docs being for javascript is somewhat irksome
const commands = loadCommands();
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
});

/**
 * Handle message replies (commands are from messages).
 */
client.on("messageCreate", async (message: Message) => {
  // because why would the bot do that
  if (message.author.bot) return;
  if (!message.content.toLowerCase().startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/\s+/);
  const commandName = args.shift()?.toLowerCase();
  if (!commandName) return; // don't give a shit

  const command = client.commands.get(commandName);
  if (!command) return; // command isn't real anyway

  try {
    await command.execute(message, args);
  } catch (err) {
    console.error(err);
    await message.reply("There was an error executing this command.");
  }
});

client.login(process.env.BOT_TOKEN);
