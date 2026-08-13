import { guildId } from "~/config.js";
import type { ClientType } from "~/types/client.js";
import type { CommandData } from "~/types/command.js";

/**
 * Registers slash commands, scoped to the configured guild when present.
 *
 * @param client the logged-in client
 */
export async function registerCommands(client: ClientType): Promise<void> {
  const seen = new Set<string>();
  const commands: CommandData[] = [];

  for (const command of client.commands.values()) {
    if (command.data && !seen.has(command.name)) {
      seen.add(command.name);
      commands.push(command.data);
    }
  }

  if (commands.length === 0) return;

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
