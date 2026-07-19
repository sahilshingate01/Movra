/**
 * Simple Token Bucket rate limiter for API routes.
 * Note: In a true multi-server production environment, use Redis or Upstash.
 * This is an in-memory implementation suitable for a single Vercel/Node instance.
 */

interface RateLimitStore {
  [ip: string]: {
    tokens: number;
    lastRefill: number;
  };
}

const store: RateLimitStore = {};

export interface RateLimitConfig {
  maxRequests: number; // Max requests in a burst
  windowMs: number;    // Window for refill in milliseconds
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
}

export function rateLimit(ip: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now();
  const { maxRequests, windowMs } = config;
  const refillRate = maxRequests / windowMs;
  
  if (!store[ip]) {
    store[ip] = {
      tokens: maxRequests - 1,
      lastRefill: now,
    };
    return { success: true, limit: maxRequests, remaining: maxRequests - 1 };
  }
  
  const record = store[ip];
  const timePassed = now - record.lastRefill;
  
  // Refill tokens
  const newTokens = Math.min(maxRequests, record.tokens + timePassed * refillRate);
  
  if (newTokens >= 1) {
    store[ip] = {
      tokens: newTokens - 1,
      lastRefill: now,
    };
    return { success: true, limit: maxRequests, remaining: Math.floor(newTokens - 1) };
  }
  
  // Rate limited
  return { success: false, limit: maxRequests, remaining: 0 };
}
