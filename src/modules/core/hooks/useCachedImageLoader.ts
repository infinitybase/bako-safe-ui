import { useEffect, useRef, useState } from 'react';

const IMAGE_CACHE_KEY = 'nftImageCache';
const DEFAULT_TIMEOUT = 6000;

const memoryImageCache = new Set<string>();
const pendingRequests = new Map<string, Promise<boolean>>();

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

const loadImage = (
  url: string,
  timeout: number = DEFAULT_TIMEOUT,
): Promise<boolean> => {
  if (pendingRequests.has(url)) return pendingRequests.get(url)!;

  const promise = new Promise<boolean>((resolve) => {
    const img = new Image();
    let timer = setTimeout(() => {
      img.src = '';
      resolve(false);
    }, timeout);

    img.onload = () => {
      clearTimeout(timer);
      resolve(true);
    };

    img.onerror = () => {
      clearTimeout(timer);
      resolve(false);
    };

    img.src = url;
  });

  pendingRequests.set(url, promise);
  return promise;
};

export const useCachedImageLoader = (
  src?: string,
  fallback?: string,
  timeout?: number,
) => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading',
  );
  const retryRef = useRef<number>(0);

  useEffect(() => {
    if (!src) {
      setStatus('error');
      return;
    }

    if (memoryImageCache.has(src)) {
      setStatus('success');
      return;
    }

    setStatus('loading');

    loadImage(src, timeout).then((success) => {
      if (success) {
        memoryImageCache.add(src);
        saveToLocalStorage();
        setStatus('success');
      } else {
        setStatus('error');
        setTimeout(() => retryRef.current++, 5000);
      }
    });
  }, [src, timeout, retryRef.current]);

  return {
    isLoading: status === 'loading',
    isError: status === 'error',
    srcToRender: status === 'error' ? fallback : src,
  };
};
