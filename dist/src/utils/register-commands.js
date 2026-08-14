import { guildId } from "~/config.js";
/**
 * Registers slash commands, scoped to the configured guild when present.
 *
 * @param client the logged-in client
 */
export async function registerCommands(client) {
    const seen = new Set();
    const commands = [];
    for (const command of client.commands.values()) {
        if (command.data && !seen.has(command.name)) {
            seen.add(command.name);
            commands.push(command.data);
        }
    }
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
