import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { imageCache } from '../utils/image-cache';

/**
 * Hook that caches images locally using the Cache API
 * Returns a blob URL for the cached image
 *
 * @param imageUrl - The original image URL to cache
 * @param enabled - Whether to enable the caching (default: true)
 */
export const useCachedImage = (
  imageUrl: string | undefined | null,
  enabled = true,
) => {
  const blobUrlRef = useRef<string | null>(null);

  const { data: cachedUrl, ...rest } = useQuery({
    queryKey: ['cachedImage', imageUrl],
    queryFn: async () => {
      if (!imageUrl) return null;
      const url = await imageCache.getOrFetch(imageUrl);
      return url;
    },
    enabled: enabled && !!imageUrl,
    // Cached images are permanent - blob URLs are created from cached data
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  // Track the blob URL for cleanup
  useEffect(() => {
    if (cachedUrl && cachedUrl.startsWith('blob:')) {
      blobUrlRef.current = cachedUrl;
    }
  }, [cachedUrl]);

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
      }
    };
  }, []);

  return {
    src: cachedUrl || imageUrl || undefined,
    isFromCache: cachedUrl?.startsWith('blob:') ?? false,
    ...rest,
  };
};

/**
 * Preload images into cache without using them immediately
 * Useful for preloading avatar images in a list
 */
export const preloadImages = async (urls: (string | undefined | null)[]) => {
  const validUrls = urls.filter((url): url is string => !!url);
  await imageCache.preload(validUrls);
};

/**
 * Clear the image cache - useful when the user explicitly requests
 */
export const clearImageCache = async () => {
  await imageCache.clearAll();
};
