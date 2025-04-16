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
    VERY_SHORT: 60, // 1 minute
    SHORT: 300, // 5 minutes
    MEDIUM: 1800, // 30 minutes
    LONG: 3600, // 1 hour
    VERY_LONG: 86400, // 24 hours
};

export function getCacheConfig(
    prefix: string,
    params: Record<string, any>,
    ttl: number = CACHE_TTL.MEDIUM,
): CacheConfig {
    return {
        ttl,
        key: generateCacheKey(prefix, params),
    };
}

export function shouldSkipCache(request: any): boolean {
    // Skip cache for authenticated requests or specific conditions
    return (
        request.headers?.authorization || request.method !== "GET" || request.headers["cache-control"] === "no-cache"
    );
}
