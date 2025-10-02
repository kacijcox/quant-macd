// src/utils/cache.ts

interface CacheItem<T> {
    data: T;
    timestamp: number;
    expiresAt: number;
}

export class Cache<T> {
    private cache: Map<string, CacheItem<T>>;
    private defaultTTL: number;

    constructor(defaultTTL: number = 300000) { // 5 minutes default
        this.cache = new Map();
        this.defaultTTL = defaultTTL;
    }

    set(key: string, data: T, ttl?: number): void {
        const now = Date.now();
        const expiresAt = now + (ttl || this.defaultTTL);

        this.cache.set(key, {
            data,
            timestamp: now,
            expiresAt
        });
    }

    get(key: string): T | null {
        const item = this.cache.get(key);

        if (!item) return null;

        if (Date.now() > item.expiresAt) {
            this.cache.delete(key);
            return null;
        }

        return item.data;
    }

    has(key: string): boolean {
        const item = this.cache.get(key);
        if (!item) return false;

        if (Date.now() > item.expiresAt) {
            this.cache.delete(key);
            return false;
        }

        return true;
    }

    delete(key: string): boolean {
        return this.cache.delete(key);
    }

    clear(): void {
        this.cache.clear();
    }

    size(): number {
        this.cleanExpired();
        return this.cache.size;
    }

    private cleanExpired(): void {
        const now = Date.now();
        for (const [key, item] of this.cache.entries()) {
            if (now > item.expiresAt) {
                this.cache.delete(key);
            }
        }
    }
}

export const priceCache = new Cache<any>(60000); // 1 minute for prices
export const tokenCache = new Cache<any>(300000); // 5 minutes for token info