/**
 * Token Bucket rate limiter for API routes.
 *
 * Uses an in-memory store with automatic cleanup of stale entries.
 * In a multi-server production environment, swap this for Redis or Upstash.
 *
 * @module lib/rateLimit
 */

import { RATE_LIMIT_CLEANUP_INTERVAL_MS } from './constants';

/** Internal record for a single IP's token bucket state. */
interface RateLimitRecord {
  tokens: number;
  lastRefill: number;
}

/** Bounded in-memory store mapping IP addresses to their token bucket state. */
const store = new Map<string, RateLimitRecord>();

/** Maximum number of active rate-limit records allowed in memory to prevent exhaustion DoS. */
const MAX_STORE_SIZE = 10000;

/** Timestamp of the last store cleanup pass. */
let lastCleanup = Date.now();

/** Configuration options for the rate limiter. */
export interface RateLimitConfig {
  /** Maximum number of requests allowed in a single burst. */
  maxRequests: number;
  /** Window duration in milliseconds for token refill. */
  windowMs: number;
}

/** Result returned by the rate limiter for each request. */
export interface RateLimitResult {
  /** Whether the request is allowed. */
  success: boolean;
  /** The configured maximum requests (burst limit). */
  limit: number;
  /** Number of remaining tokens in this window. */
  remaining: number;
}

/**
 * Evicts stale entries from the rate-limit store to prevent memory leaks.
 * An entry is considered stale if it hasn't been accessed for longer than
 * twice the cleanup interval.
 *
 * @param windowMs - The rate limit window used to determine staleness.
 */
function cleanupStore(windowMs: number): void {
  const now = Date.now();
  if (now - lastCleanup < RATE_LIMIT_CLEANUP_INTERVAL_MS) return;

  const staleThreshold = now - windowMs * 2;
  for (const [ip, record] of store.entries()) {
    if (record.lastRefill < staleThreshold) {
      store.delete(ip);
    }
  }
  lastCleanup = now;
}

/**
 * Checks whether a request from the given IP is allowed under the configured rate limit.
 *
 * Implements a Token Bucket algorithm: each IP gets `maxRequests` tokens that refill
 * continuously over the `windowMs` window. Each request consumes one token.
 *
 * @param ip - The client IP address (or a fallback identifier).
 * @param config - Rate limit configuration (burst size and window).
 * @returns A {@link RateLimitResult} indicating whether the request is allowed.
 *
 * @example
 * ```ts
 * const result = rateLimit('192.168.1.1', { maxRequests: 10, windowMs: 10000 });
 * if (!result.success) {
 *   return new Response('Too Many Requests', { status: 429 });
 * }
 * ```
 */
export function rateLimit(ip: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now();
  const { maxRequests, windowMs } = config;
  const refillRate = maxRequests / windowMs;

  // Periodically clean up stale entries to prevent memory leaks
  cleanupStore(windowMs);

  // Evict oldest entries if store grows too large to prevent DoS (LRU eviction)
  if (store.size >= MAX_STORE_SIZE && !store.has(ip)) {
    const oldestKey = store.keys().next().value;
    if (oldestKey !== undefined) {
      store.delete(oldestKey);
    }
  }

  if (!store.has(ip)) {
    const record = {
      tokens: maxRequests - 1,
      lastRefill: now,
    };
    store.set(ip, record);
    return { success: true, limit: maxRequests, remaining: maxRequests - 1 };
  }

  const record = store.get(ip)!;
  const timePassed = now - record.lastRefill;

  // Refill tokens based on elapsed time
  const newTokens = Math.min(maxRequests, record.tokens + timePassed * refillRate);

  if (newTokens >= 1) {
    const updatedRecord = {
      tokens: newTokens - 1,
      lastRefill: now,
    };
    // Delete and set to move it to the end of the Map (most recently used)
    store.delete(ip);
    store.set(ip, updatedRecord);
    return { success: true, limit: maxRequests, remaining: Math.floor(newTokens - 1) };
  }

  // Rate limited — no tokens available
  return { success: false, limit: maxRequests, remaining: 0 };
}
