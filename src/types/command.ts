import {
  ChatInputCommandInteraction,
  Message,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";
import type { CommandIntent } from "~/utils/intents.js";

export type CommandData =
  | SlashCommandBuilder
  | SlashCommandOptionsOnlyBuilder
  | SlashCommandSubcommandsOnlyBuilder;

export interface Command {
  name: string; // primary command name
  aliases?: string[];
  description?: string;
  data?: CommandData; // slash definition; omit to keep message-only
  messageExecute: (
    message: Message,
    args: string[],
    intent?: CommandIntent
  ) => Promise<void>;
  interactionExecute?: (interaction: ChatInputCommandInteraction) => Promise<void>;
}
