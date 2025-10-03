import { Message } from "discord.js";

export interface Command {
  name: string; // primary command name
  aliases?: string[];
  description?: string;
  execute: (message: Message, args: string[]) => Promise<void>;
}
