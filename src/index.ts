import "dotenv/config";
import {
  Client,
  Collection,
  GatewayIntentBits,
  REST,
  Routes,
} from "discord.js";
import type { ClientType } from "./types/client";
import { loadCommands } from "./utils/load-commands";
import type { Command } from "./types/command";

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
  client.commands.set(command.data.name, command);
}

// Register slash commands
const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN!);
(async () => {
  try {
    console.log("Refreshing application (/) commands...");

    // put application commands
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID ?? ""), {
      body: commands.map((cmd) => cmd.data.toJSON()),
    });

    console.log("Reloaded application (/) commands.");
  } catch (err) {
    console.error(err);
  }
})();

/**
 * Bot client ready.
 */
client.on("clientReady", (c) => {
  console.log(`${c.user.username} is online.`);
});

/**
 * Create interactions.
 */
client.on("interactionCreate", async (interaction) => {
  // only care about these guys
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return; // dead

  try {
    await command.execute(interaction);
  } catch (err) {
    // something fucked up
    console.error(err);
    // TODO: translation
    await interaction.reply({
      content: "There was an error executing this command.",
      ephemeral: true,
    });
  }
});

client.login(process.env.BOT_TOKEN);
