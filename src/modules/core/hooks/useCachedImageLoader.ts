import { useEffect, useRef, useState } from 'react';
import { resolveIpfsUrl } from '../utils/ipfsUrlResolver';

const IMAGE_CACHE_KEY = 'nftImageCache';
const DEFAULT_TIMEOUT = 6000;
const RETRY_DELAY = 3000;
const MAX_RETRIES = 3;

const memoryImageCache = new Set<string>();

(() => {
  try {
    const raw = localStorage.getItem(IMAGE_CACHE_KEY);
    const items = JSON.parse(raw ?? '[]');
    items.forEach((url: string) => memoryImageCache.add(url));
  } catch {}
})();

const saveToLocalStorage = () => {
  try {
    localStorage.setItem(
      IMAGE_CACHE_KEY,
      JSON.stringify(Array.from(memoryImageCache)),
    );
  } catch {}
};

export const useCachedImageLoader = (
  src?: string,
  fallback?: string,
  timeout: number = DEFAULT_TIMEOUT,
) => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading',
  );
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryCountRef = useRef(0);

  useEffect(() => {
    const processSrc = async () => {
      if (!src) {
        setStatus('error');
        return;
      }

      const resolvedSrc = await resolveIpfsUrl(src);

      if (memoryImageCache.has(src)) {
        setStatus('success');
        return;
      }

      setStatus('loading');

      const img = new Image();

      const handleLoad = () => {
        clearAllTimeouts();
        memoryImageCache.add(src);
        saveToLocalStorage();
        setStatus('success');
      };

      const handleError = () => {
        clearAllTimeouts();

        if (retryCountRef.current < MAX_RETRIES) {
          retryCountRef.current += 1;
          setStatus('loading');
          retryTimeoutRef.current = setTimeout(() => {
            setStatus('loading');
          }, RETRY_DELAY);
        } else {
          setStatus('error');
        }
      };

      timeoutRef.current = setTimeout(() => {
        handleError();
      }, timeout);

      img.onload = handleLoad;
      img.onerror = handleError;
      img.src = src;

      if (img.complete) {
        handleLoad();
      }
    };

    processSrc();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [src, timeout]);

  const clearAllTimeouts = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
  };

  return {
    isLoading: status === 'loading',
    isError: status === 'error',
    srcToRender: status === 'error' ? fallback : src,
  };
};
