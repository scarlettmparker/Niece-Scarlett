import type { APIEmbed } from "discord.js";
import { EmbedMessage } from "~/components/embed.js";
import { loadTranslations } from "~/translations/index.js";

const t = loadTranslations("bot");

/**
 * A command entry from the accessibleCommandIntents query.
 */
export type CommandEntry = {
  /**
   * The command name (e.g. "texts", "classify").
   */
  entryName: string;
  /**
   * The command's property-set values (description, permission, rateLimit, etc.).
   */
  values: Record<string, unknown>;
};

/**
 * Builds an embed listing all accessible commands.
 *
 * @param commands the accessible command entries
 */
export function helpListEmbed(commands: CommandEntry[]): APIEmbed {
  const embed = new EmbedMessage()
    .setTitle(t("help.title"))
    .setFooter("ns help <command> for details");
  if (!commands.length) {
    return embed.setBody(t("help.empty")).build();
  }
  const lines = commands.map((cmd) => {
    const description = String(cmd.values.description ?? "");
    return description
      ? `\`${cmd.entryName}\` · ${description}`
      : `\`${cmd.entryName}\``;
  });
  return embed.setBody(lines.join("\n")).build();
}

/**
 * Builds an embed showing detailed help for a single command.
 *
 * @param entry the command entry from the propertyset
 * @param helpContent optional blog post content to render
 */
export function helpDetailEmbed(
  entry: CommandEntry,
  helpContent?: string,
): APIEmbed {
  const embed = new EmbedMessage().setTitle(entry.entryName);
  if (helpContent) {
    embed.setBody(helpContent);
  } else {
    addDescription(embed, entry);
    addPermission(embed, entry);
    addRateLimit(embed, entry);
  }
  return embed.build();
}

/**
 * Appends the command description to the embed.
 *
 * @param embed the embed builder
 * @param entry the command entry
 */
function addDescription(embed: EmbedMessage, entry: CommandEntry) {
  const description = String(entry.values.description ?? "");
  if (description) {
    embed.addLine(description);
  }
}

/**
 * Appends the permission requirement to the embed, when set.
 *
 * @param embed the embed builder
 * @param entry the command entry
 */
function addPermission(embed: EmbedMessage, entry: CommandEntry) {
  const permission = entry.values.permission;
  if (permission) {
    embed.addLine(`\n**${t("help.permission")}:** \`${permission}\``);
  }
}

/**
 * Appends global and per-channel rate limits to the embed, when set.
 *
 * @param embed the embed builder
 * @param entry the command entry
 */
function addRateLimit(embed: EmbedMessage, entry: CommandEntry) {
  const rateLimit = entry.values.rateLimit;
  if (!rateLimit || typeof rateLimit !== "object") return;
  const rl = rateLimit as Record<string, unknown>;
  addGlobalRateLimit(embed, rl);
  addChannelRateLimits(embed, rl);
}

/**
 * Appends the global rate limit line.
 *
 * @param embed the embed builder
 * @param rl the rate limit config
 */
function addGlobalRateLimit(embed: EmbedMessage, rl: Record<string, unknown>) {
  const line = formatRateLimit(rl.capacity, rl.refillPerSecond);
  if (line) {
    embed.addLine(`\n**${t("help.rate-limit")}:** ${line}`);
  }
}

/**
 * Appends per-channel rate limit lines.
 *
 * @param embed the embed builder
 * @param rl the rate limit config
 */
function addChannelRateLimits(
  embed: EmbedMessage,
  rl: Record<string, unknown>,
) {
  const channels = rl.channels;
  if (!channels || typeof channels !== "object") return;
  for (const [chId, chConfig] of Object.entries(channels)) {
    const cfg = chConfig as Record<string, unknown>;
    const line = formatRateLimit(cfg.capacity, cfg.refillPerSecond);
    if (line) {
      embed.addLine(`> <#${chId}> · ${line}`);
    }
  }
}

/**
 * Formats a capacity and refill into a human-readable string.
 *
 * @param capacity the bucket capacity
 * @param refillPerSecond the refill rate
 * @return e.g. "5 per 4s", or null when inputs are missing
 */
function formatRateLimit(
  capacity: unknown,
  refillPerSecond: unknown,
): string | null {
  if (capacity == null || refillPerSecond == null) return null;
  const perSecond = Number(refillPerSecond);
  const interval =
    perSecond >= 1 ? `${perSecond}/s` : `${Math.round(1 / perSecond)}s`;
  return `${capacity} per ${interval}`;
}
