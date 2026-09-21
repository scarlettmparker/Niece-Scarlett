import { fetchEffectivePermissions } from "~/utils/api.js";
const PATTERN_CACHE = new Map();
const PERMISSION_CACHE = new Map();
const PERMISSION_TTL_MS = 5 * 60 * 1000;
/**
 * Whether a permission pattern covers a required permission.
 *
 * Mirrors the backend's PermissionService: a literal dot and `*` as a glob.
 *
 * @param required the permission being requested
 * @param pattern the granted pattern
 */
export function matchPermission(required, pattern) {
    if (pattern === "*") {
        return true;
    }
    let compiled = PATTERN_CACHE.get(pattern);
    if (!compiled) {
        compiled = new RegExp(`^${pattern.replace(/\./g, "\\.").replace(/\*/g, ".*")}$`);
        PATTERN_CACHE.set(pattern, compiled);
    }
    return compiled.test(required);
}
/**
 * Fetches a Discord user's effective permission patterns, cached briefly.
 *
 * @param discordId the Discord user id
 */
export async function effectivePermissions(discordId) {
    const now = Date.now();
    const cached = PERMISSION_CACHE.get(discordId);
    if (cached && cached.expiresAt > now) {
        return cached.patterns;
    }
    const result = await fetchEffectivePermissions(discordId);
    const patterns = result.success && result.data?.gaiaQueries
        ? (result.data.gaiaQueries.effectivePermissions ?? [])
        : [];
    PERMISSION_CACHE.set(discordId, {
        patterns,
        expiresAt: now + PERMISSION_TTL_MS,
    });
    return patterns;
}
/**
 * Whether a Discord user may run a command requiring the given permission.
 *
 * @param discordId the Discord user id
 * @param required the permission the command needs
 */
export async function canRun(discordId, required) {
    const patterns = await effectivePermissions(discordId);
    return patterns.some((pattern) => matchPermission(required, pattern));
}
/**
 * Thread-safe in-memory token bucket for a single rate-limit key.
 */
class TokenBucket {
    capacity;
    refillPerSecond;
    tokens;
    lastRefill = Date.now();
    constructor(capacity, refillPerSecond) {
        this.capacity = capacity;
        this.refillPerSecond = refillPerSecond;
        this.tokens = capacity;
    }
    matches(capacity, refillPerSecond) {
        return this.capacity === capacity && this.refillPerSecond === refillPerSecond;
    }
    tryConsume() {
        this.refill();
        if (this.tokens < 1) {
            return false;
        }
        this.tokens -= 1;
        return true;
    }
    refund() {
        this.refill();
        this.tokens = Math.min(this.capacity, this.tokens + 1);
    }
    retryAfterSeconds() {
        this.refill();
        if (this.tokens >= 1) {
            return 0;
        }
        return Math.ceil((1 - this.tokens) / this.refillPerSecond);
    }
    refill() {
        const now = Date.now();
        const gained = (this.refillPerSecond * (now - this.lastRefill)) / 1000;
        this.tokens = Math.min(this.capacity, this.tokens + gained);
        this.lastRefill = now;
    }
}
const BUCKETS = new Map();
function bucket(key, capacity, refillPerSecond) {
    const existing = BUCKETS.get(key);
    if (existing && existing.matches(capacity, refillPerSecond)) {
        return existing;
    }
    const created = new TokenBucket(capacity, refillPerSecond);
    BUCKETS.set(key, created);
    return created;
}
/**
 * Reserves a token for a key, consuming it atomically when available.
 *
 * @param key the bucket key
 * @param capacity the bucket's maximum burst size
 * @param refillPerSecond tokens restored per second
 * @return the outcome, including how long to wait when denied
 */
export function reserveRateLimit(key, capacity, refillPerSecond) {
    const found = bucket(key, capacity, refillPerSecond);
    if (found.tryConsume()) {
        return { allowed: true, retryAfter: 0 };
    }
    return { allowed: false, retryAfter: found.retryAfterSeconds() };
}
/**
 * Returns a reserved token when the attempt it backed failed.
 *
 * @param key the bucket key
 * @param capacity the bucket's maximum burst size
 * @param refillPerSecond tokens restored per second
 */
export function refundRateLimit(key, capacity, refillPerSecond) {
    bucket(key, capacity, refillPerSecond).refund();
}
