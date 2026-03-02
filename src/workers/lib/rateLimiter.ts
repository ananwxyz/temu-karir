/**
 * Token bucket rate limiter
 * - Global: max 100 requests/minute
 * - Per domain: 1 request/second
 */

class TokenBucket {
    private tokens: number;
    private lastRefill: number;

    constructor(
        private maxTokens: number,
        private refillRate: number // tokens per ms
    ) {
        this.tokens = maxTokens;
        this.lastRefill = Date.now();
    }

    async acquire(): Promise<void> {
        this.refill();

        if (this.tokens >= 1) {
            this.tokens -= 1;
            return;
        }

        // Wait until a token is available
        const waitMs = Math.ceil((1 - this.tokens) / this.refillRate);
        await new Promise((r) => setTimeout(r, waitMs));
        this.refill();
        this.tokens -= 1;
    }

    private refill() {
        const now = Date.now();
        const elapsed = now - this.lastRefill;
        this.tokens = Math.min(this.maxTokens, this.tokens + elapsed * this.refillRate);
        this.lastRefill = now;
    }
}

// Global: 100 requests per minute = ~1.67 tokens/s
const globalLimiter = new TokenBucket(100, 100 / 60000);

// Per-domain limiters: 1 request per second
const domainLimiters = new Map<string, TokenBucket>();

function getDomainLimiter(domain: string): TokenBucket {
    if (!domainLimiters.has(domain)) {
        domainLimiters.set(domain, new TokenBucket(1, 1 / 1000));
    }
    return domainLimiters.get(domain)!;
}

/**
 * Acquire rate limit token for a domain
 * Waits if rate limit is reached
 */
export async function acquireRateLimit(domain: string): Promise<void> {
    await globalLimiter.acquire();
    await getDomainLimiter(domain).acquire();
}

/**
 * Process items with controlled concurrency
 */
export async function processConcurrently<T, R>(
    items: T[],
    fn: (item: T) => Promise<R>,
    concurrency = 5
): Promise<R[]> {
    const results: R[] = [];
    const queue = [...items];

    async function worker() {
        while (queue.length > 0) {
            const item = queue.shift()!;
            const result = await fn(item);
            results.push(result);
        }
    }

    const workers = Array.from(
        { length: Math.min(concurrency, items.length) },
        () => worker()
    );

    await Promise.all(workers);
    return results;
}
