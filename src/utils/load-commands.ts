import { readdirSync, statSync } from "fs";
import * as path from "path";
import { Command } from "~/types/command";

/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * Load commands recursively from the commands directory.
 */
export function loadCommands(
  dir = path.join(__dirname, "../commands")
): Command[] {
  const commands: Command[] = [];

  /**
   * Read commands from a directory.
   *
   * @param directory Directory to read
   */
  function readCommands(directory: string) {
    const files = readdirSync(directory);

    for (const file of files) {
      const fullPath = path.join(directory, file);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        readCommands(fullPath); // recurse into folders
      } else if (file.endsWith(".ts") || file.endsWith(".js")) {
        const commandModule = require(fullPath);
        const command: Command = commandModule.default || commandModule;

        if (command && command.name && typeof command.execute === "function") {
          commands.push(command);
        }

        // TODO: we want logging
      }
    }
  }

  readCommands(dir);
  return commands;
}
