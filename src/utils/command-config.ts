import { fetchPropertySet } from "~/utils/api.js";
import type { Command } from "~/types/command.js";

const OWNER_KEY = "NieceScarlett";
const SET_NAME = "command-intents";
const CACHE_TTL_MS = 30 * 60 * 1000;

export interface RateLimitConfig {
  /**
   * The bucket's maximum burst size. Zero disables the command.
   */
  capacity: number;
  /**
   * Tokens restored per second.
   */
  refillPerSecond: number;
  /**
   * Per-channel overrides keyed by channel id.
   */
  channels?: Record<string, RateLimitConfig>;
}

interface CommandConfig {
  /**
   * The required permission glob, or null to clear a code default.
   */
  permission?: string | null;
  /**
   * The rate limit (global and per-channel), or null to clear a code default.
   */
  rateLimit?: RateLimitConfig | null;
}

interface CachedConfig {
  /**
   * The cached config.
   */
  config: CommandConfig;
  /**
   * When the cached config expires.
   */
  expiresAt: number;
}

const CACHE = new Map<string, CachedConfig>();

/**
 * Merges a command's runtime config over its code defaults.
 *
 * @param command the command being invoked
 * @return the effective permission and rate limit
 */
export async function effectiveCommandConfig(
  command: Command,
): Promise<CommandConfig> {
  const entry = await fetchConfig(command.name);
  const rateLimit = mergeRateLimit(command.rateLimit, entry.rateLimit);
  return {
    permission:
      entry.permission === undefined ? command.permission : entry.permission,
    rateLimit,
  };
}

/**
 * Resolves the rate-limit config for a channel, falling back to the global limit.
 *
 * @param config the merged command config
 * @param channelId the discord channel id
 * @return the rate limit, or undefined when unrestricted
 */
export function rateLimitFor(
  config: CommandConfig,
  channelId: string | undefined,
): RateLimitConfig | undefined {
  const global = config.rateLimit;
  if (!global) {
    return undefined;
  }
  if (channelId && global.channels?.[channelId]) {
    return global.channels[channelId];
  }
  return global;
}

/**
 * Clears the cached runtime command config.
 */
export function flushCommandConfig(): void {
  CACHE.clear();
}

/**
 * Fetches a command's runtime config, cached for thirty minutes.
 *
 * @param name the command name
 */
async function fetchConfig(name: string): Promise<CommandConfig> {
  const now = Date.now();
  const cached = CACHE.get(name);
  if (cached && cached.expiresAt > now) {
    return cached.config;
  }
  const result = await fetchPropertySet(OWNER_KEY, SET_NAME, name);
  const entry = result.success
    ? (result.data?.gaiaQueries.propertySet as CommandConfig | null)
    : null;
  const config: CommandConfig = {
    permission: entry?.permission,
    rateLimit: entry?.rateLimit,
  };
  CACHE.set(name, { config, expiresAt: now + CACHE_TTL_MS });
  return config;
}

/**
 * Merges a propertyset override over a code default, keeping channels from both.
 *
 * @param code the code default
 * @param overrides the propertyset override
 */
function mergeRateLimit(
  code: RateLimitConfig | undefined | null,
  overrides: RateLimitConfig | undefined | null,
): RateLimitConfig | undefined | null {
  if (overrides === undefined) {
    return code ?? undefined;
  }
  if (overrides === null) {
    return null;
  }
  if (!code) {
    return overrides;
  }
  return {
    capacity: overrides.capacity,
    refillPerSecond: overrides.refillPerSecond,
    channels: { ...code.channels, ...overrides.channels },
  };
}
