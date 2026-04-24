/**
 * Simple in-memory cache for CoinGecko API responses.
 * Prevents duplicate requests within the TTL window and avoids rate limiting.
 */

interface CacheEntry {
  data: unknown;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();

const DEFAULT_TTL = 60_000; // 60 seconds

/**
 * Get a cached response or fetch and cache it.
 */
export async function cachedFetch<T>(
  url: string,
  ttlMs: number = DEFAULT_TTL
): Promise<T> {
  const now = Date.now();

  // Return cached data if still valid
  const cached = cache.get(url);
  if (cached && cached.expiresAt > now) {
    return cached.data as T;
  }

  // Fetch with retry
  const data = await fetchWithRetry<T>(url);

  // Store in cache
  cache.set(url, { data, expiresAt: now + ttlMs });

  // Cleanup old entries (keep cache bounded)
  if (cache.size > 200) {
    for (const [key, entry] of cache) {
      if (entry.expiresAt < now) cache.delete(key);
    }
  }

  return data;
}

/**
 * Fetch with retry logic for CoinGecko rate limits (429).
 */
async function fetchWithRetry<T>(
  url: string,
  retries = 4
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    const res = await fetch(url);

    if (res.ok) {
      return res.json() as Promise<T>;
    }

    // Rate limited — wait progressively longer
    if (res.status === 429 && i < retries - 1) {
      const waitMs = (i + 1) * 4000; // 4s, 8s, 12s, 16s
      console.warn(`[CoinGecko] Terkena batas limit (429), mencoba lagi dalam ${waitMs}ms...`);
      await new Promise((r) => setTimeout(r, waitMs));
      continue;
    }

    // Server error — short retry
    if (res.status >= 500 && i < retries - 1) {
      await new Promise((r) => setTimeout(r, 2000));
      continue;
    }

    throw new Error(`CoinGecko API error ${res.status}: ${res.statusText}`);
  }

  throw new Error("Max retries exceeded");
}
