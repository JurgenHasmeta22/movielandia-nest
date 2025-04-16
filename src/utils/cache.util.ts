export interface CacheConfig {
    ttl: number; // Time to live in seconds
    key: string;
}

export function generateCacheKey(prefix: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
        .sort()
        .reduce(
            (acc, key) => {
                acc[key] = params[key];
                return acc;
            },
            {} as Record<string, any>,
        );

    return `${prefix}:${JSON.stringify(sortedParams)}`;
}

export const CACHE_TTL = {
    SHORT: 60 * 5, // 5 minutes
    MEDIUM: 60 * 30, // 30 minutes
    LONG: 60 * 60 * 24, // 24 hours
};

export function getCacheConfig(key: string, data: any, ttl: number) {
    return {
        key,
        ttl,
        data,
    };
}

export function shouldSkipCache(options: { method?: string } = {}) {
    if (process.env.NODE_ENV === "test") {
        return true;
    }

    return options.method !== "GET";
}
