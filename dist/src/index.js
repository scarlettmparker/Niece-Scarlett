import { Client, Collection, GatewayIntentBits, } from "discord.js";
import { botToken } from "~/config.js";
import { handleListPage, handleListSelect, isTextListId, isTextListSelectId, } from "~/components/text-list.js";
import { TEXT_VIEWER_PREFIX, handleViewerButton } from "~/components/text-viewer.js";
import { loadCommands } from "~/utils/load-commands.js";
import { registerCommands } from "~/utils/register-commands.js";
const PREFIX = "niece scarlett";
/**
 * Boots the Discord client and logs in.
 */
export async function bootClient() {
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds, // dpp default intents
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent, // dpp i_message_content
            GatewayIntentBits.GuildMembers, // dpp i_guild_member
        ],
    });
    // Load commands
    const commands = await loadCommands();
    client.commands = new Collection();
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
        registerCommands(client).catch((err) => console.error("Failed to register slash commands", err));
    });
    /**
     * Handle message replies (commands are from messages).
     */
    client.on("messageCreate", async (message) => {
        // because why would the bot do that
        if (message.author.bot)
            return;
        if (!message.content.toLowerCase().startsWith(PREFIX))
            return;
        const content = message.content.slice(PREFIX.length).trim();
        const matched = matchCommand(client.commands, content);
        if (!matched)
            return; // command isn't real anyway
        try {
            await matched.command.messageExecute(message, matched.args);
        }
        catch (err) {
            console.error(err);
            await message.reply("There was an error executing this command.");
        }
    });
    /**
     * Handle slash commands and their message components.
     */
    client.on("interactionCreate", async (interaction) => {
        try {
            if (interaction.isChatInputCommand()) {
                const command = client.commands.get(interaction.commandName);
                if (command?.interactionExecute) {
                    await command.interactionExecute(interaction);
                }
                return;
            }
            if (interaction.isButton()) {
                if (interaction.customId.startsWith(TEXT_VIEWER_PREFIX)) {
                    await handleViewerButton(interaction);
                }
                else if (isTextListId(interaction.customId)) {
                    await handleListPage(interaction);
                }
                return;
            }
            if (interaction.isStringSelectMenu() && isTextListSelectId(interaction.customId)) {
                await handleListSelect(interaction);
            }
        }
        catch (err) {
            console.error(err);
            if (interaction.isRepliable()) {
                await interaction
                    .reply({ content: "There was an error executing this command.", ephemeral: true })
                    .catch(() => { });
            }
        }
    });
    await client.login(botToken);
}
/**
 * Resolves the command and its arguments from a prefixed message.
 *
 * @param commands the command registry keyed by name and alias
 * @param content the message content after the prefix
 */
function matchCommand(commands, content) {
    const lower = content.toLowerCase();
    let best = null;
    for (const [key, command] of commands) {
        const keyLower = key.toLowerCase();
        if (lower === keyLower || lower.startsWith(keyLower + " ")) {
            if (!best || keyLower.length > best.key.length) {
                best = { command, key: keyLower };
            }
        }
    }
    if (!best)
        return null;
    const rest = content.slice(best.key.length).trim();
    return {
        command: best.command,
        args: rest.length > 0 ? rest.split(/\s+/) : [],
    };
}
