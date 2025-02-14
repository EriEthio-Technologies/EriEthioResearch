import { LRUCache } from 'lru-cache';

type Options = {
  interval: number;
  uniqueTokenPerInterval: number;
};

export function rateLimit(options: Options) {
  const tokenCache = new LRUCache<string, number>({
    max: options.uniqueTokenPerInterval,
    ttl: options.interval,
  });

  return {
    check: (limit: number, token: string) => {
      const tokenCount = (tokenCache.get(token) || 0) + 1;
      tokenCache.set(token, tokenCount);
      return tokenCount <= limit;
    },
  };
} 