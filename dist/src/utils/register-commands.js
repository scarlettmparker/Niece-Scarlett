import { guildId } from "~/config.js";
/**
 * Registers slash commands, scoped to the configured guild when present.
 *
 * @param client the logged-in client
 */
export async function registerCommands(client) {
    const commands = Array.from(client.commands.values())
        .filter((command) => command.data)
        .map((command) => command.data);
    if (commands.length === 0)
        return;
    const json = commands.map((command) => command.toJSON());
    if (guildId) {
        const guild = client.guilds.cache.get(guildId);
        if (guild) {
            await guild.commands.set(json);
            return;
        }
    }
    await client.application?.commands.set(json);
}
