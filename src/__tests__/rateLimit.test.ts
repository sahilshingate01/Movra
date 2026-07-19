import { describe, it, expect, beforeEach, vi } from 'vitest';
import { rateLimit } from '../lib/rateLimit';

describe('rateLimit', () => {
  beforeEach(() => {
    // Reset the internal store by testing with a new IP each time
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('allows the first request', () => {
    const ip = '192.168.1.1';
    const result = rateLimit(ip, { maxRequests: 5, windowMs: 1000 });
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it('limits requests exceeding maxRequests within window', () => {
    const ip = '192.168.1.2';
    const config = { maxRequests: 2, windowMs: 10000 };
    
    // 1st request
    expect(rateLimit(ip, config).success).toBe(true);
    
    // 2nd request
    expect(rateLimit(ip, config).success).toBe(true);
    
    // 3rd request - should be blocked
    expect(rateLimit(ip, config).success).toBe(false);
  });

  it('refills tokens over time', () => {
    const ip = '192.168.1.3';
    const config = { maxRequests: 2, windowMs: 1000 };
    
    expect(rateLimit(ip, config).success).toBe(true);
    expect(rateLimit(ip, config).success).toBe(true);
    expect(rateLimit(ip, config).success).toBe(false); // Depleted
    
    // Advance time by 500ms - should refill 1 token
    vi.advanceTimersByTime(500);
    
    expect(rateLimit(ip, config).success).toBe(true);
    expect(rateLimit(ip, config).success).toBe(false); // Depleted again
    
    // Advance time by 1000ms - should refill 2 tokens
    vi.advanceTimersByTime(1000);
    expect(rateLimit(ip, config).success).toBe(true);
    expect(rateLimit(ip, config).success).toBe(true);
  });
});
