import { readdirSync, statSync } from "fs";
import * as path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import type { Command } from "~/types/command.js";

const COMMANDS_DIR = fileURLToPath(new URL("../commands", import.meta.url));

/**
 * Load commands recursively from the commands directory.
 *
 * @param dir the directory to scan
 */
export async function loadCommands(dir: string = COMMANDS_DIR): Promise<Command[]> {
  const commands: Command[] = [];
  const pending = [dir];

  while (pending.length > 0) {
    const directory = pending.pop()!;

    for (const file of readdirSync(directory)) {
      const fullPath = path.join(directory, file);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        pending.push(fullPath); // recurse into folders
      } else if (file.endsWith(".ts") || file.endsWith(".js")) {
        const commandModule = await import(pathToFileURL(fullPath).href);
        const command: Command = commandModule.default ?? commandModule;

        if (command && command.name && typeof command.messageExecute === "function") {
          commands.push(command);
        }

        // TODO: we want logging
      }
    }
  }

  return commands;
}
