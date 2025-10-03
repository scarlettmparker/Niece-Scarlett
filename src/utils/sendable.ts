import {
  Channel,
  TextChannel,
  NewsChannel,
  DMChannel,
  ThreadChannel,
} from "discord.js";

/**
 * Check if a message is sendable in a channel.
 *
 * @param channel Channel to send to.
 */
export function sendable(
  channel: unknown
): channel is TextChannel | NewsChannel | DMChannel | ThreadChannel {
  return (
    channel instanceof TextChannel ||
    channel instanceof NewsChannel ||
    channel instanceof DMChannel ||
    channel instanceof ThreadChannel
  );
}
