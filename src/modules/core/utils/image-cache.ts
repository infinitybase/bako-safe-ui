const CACHE_NAME = 'bako-safe-images-v1';
const CACHE_VERSION = 1;
const CACHE_VERSION_KEY = 'BAKO_IMAGE_CACHE_VERSION';

/**
 * Image cache service using the Cache API
 * Caches images locally in the browser for offline access and performance
 */
export const imageCache = {
  /**
   * Initialize the cache and handle version migrations
   */
  async init(): Promise<void> {
    const storedVersion = localStorage.getItem(CACHE_VERSION_KEY);
    const currentVersion = CACHE_VERSION.toString();

    if (storedVersion !== currentVersion) {
      // Clear old cache on version change (silent update)
      await this.clearAll();
      localStorage.setItem(CACHE_VERSION_KEY, currentVersion);
    }
  },

  /**
   * Get a cached image URL or fetch and cache if not present
   * Returns a blob URL that can be used directly in img src
   */
  async getOrFetch(url: string): Promise<string> {
    if (!url || !('caches' in window)) {
      return url;
    }

    try {
      const cache = await caches.open(CACHE_NAME);

      // Try to get from cache first
      const cachedResponse = await cache.match(url);
      if (cachedResponse) {
        const blob = await cachedResponse.blob();
        return URL.createObjectURL(blob);
      }

      // Fetch and cache
      const response = await fetch(url, { mode: 'cors' });
      if (!response.ok) {
        return url;
      }

      // Clone the response because we need to use it twice
      const responseToCache = response.clone();

      // Store in cache (async, don't wait)
      cache.put(url, responseToCache).catch(() => {
        // Silent fail for cache write errors
      });

      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch {
      // Return original URL on any error
      return url;
    }
  },

  /**
   * Check if an image is cached
   */
  async has(url: string): Promise<boolean> {
    if (!url || !('caches' in window)) {
      return false;
    }

    try {
      const cache = await caches.open(CACHE_NAME);
      const response = await cache.match(url);
      return !!response;
    } catch {
      return false;
    }
  },

  /**
   * Manually cache an image
   */
  async cache(url: string): Promise<void> {
    if (!url || !('caches' in window)) {
      return;
    }

    try {
      const cache = await caches.open(CACHE_NAME);
      const existing = await cache.match(url);
      if (existing) {
        return;
      }

      const response = await fetch(url, { mode: 'cors' });
      if (response.ok) {
        await cache.put(url, response);
      }
    } catch {
      // Silent fail
    }
  },

  /**
   * Remove a specific image from cache
   */
  async remove(url: string): Promise<boolean> {
    if (!url || !('caches' in window)) {
      return false;
    }

    try {
      const cache = await caches.open(CACHE_NAME);
      return await cache.delete(url);
    } catch {
      return false;
    }
  },

  /**
   * Clear all cached images
   */
  async clearAll(): Promise<boolean> {
    if (!('caches' in window)) {
      return false;
    }

    try {
      return await caches.delete(CACHE_NAME);
    } catch {
      return false;
    }
  },

  /**
   * Preload multiple images into cache
   * Useful for batch caching avatar URLs
   */
  async preload(urls: string[]): Promise<void> {
    if (!('caches' in window)) {
      return;
    }

    await Promise.allSettled(urls.map((url) => this.cache(url)));
  },
};

// Initialize cache on module load
if (typeof window !== 'undefined') {
  imageCache.init().catch(() => {
    // Silent fail on init error
  });
}
