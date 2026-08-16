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

import type { RateLimitConfig } from "~/utils/command-config.js";

export interface Command {
  // primary command name
  name: string;
  aliases?: string[];
  description?: string;
  // slash definition; omit to keep message-only
  data?: CommandData;
  // required permission glob, when access-controlled
  permission?: string;
  // global limit, with optional per-channel overrides
  rateLimit?: RateLimitConfig;
  // true when the underlying fetch succeeded
  messageExecute: (
    message: Message,
    args: string[],
    intent?: CommandIntent,
  ) => Promise<boolean | void>;
  // true when the underlying fetch succeeded
  interactionExecute?: (
    interaction: ChatInputCommandInteraction,
  ) => Promise<boolean | void>;
}
