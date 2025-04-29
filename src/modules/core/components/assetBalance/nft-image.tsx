import { Center, Image, Spinner } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { CustomSkeleton } from '@/components';

const DEFAULT_TIMEOUT = 6000;
const IMAGE_CACHE_KEY = 'nftImageCache';

function isValidCacheUrl(url: string) {
  return /^https?:\/\/.+/.test(url) || /^ipfs:\/\//.test(url);
}

const memoryImageCache = (() => {
  try {
    const raw = localStorage.getItem(IMAGE_CACHE_KEY);
    return new Set<string>(JSON.parse(raw ?? '[]'));
  } catch {
    return new Set<string>();
  }
})();

const getImageCache = (): Set<string> => {
  try {
    const raw = localStorage.getItem(IMAGE_CACHE_KEY);
    return new Set(JSON.parse(raw ?? '[]'));
  } catch {
    return new Set();
  }
};

const setImageCache = (url: string) => {
  if (!isValidCacheUrl(url)) return;

  if (!memoryImageCache.has(url)) {
    memoryImageCache.add(url);
    localStorage.setItem(
      IMAGE_CACHE_KEY,
      JSON.stringify(Array.from(memoryImageCache)),
    );
  }
};

type NftImageProps = {
  src?: string;
  fallback?: string;
  timeout?: number;
};

export const NftImage = ({
  src,
  fallback = '/nft-empty.svg',
  timeout = DEFAULT_TIMEOUT,
}: NftImageProps) => {
  const [state, setState] = useState({
    isLoading: true,
    isError: false,
  });

  const [retryLoad, setRetryLoad] = useState(0);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!src?.trim()) {
      setState({ isLoading: false, isError: true });
      return;
    }

    if (memoryImageCache.has(src)) {
      setState({ isLoading: false, isError: false });

      const img = new window.Image();
      img.src = src;
      img.onerror = () => {
        memoryImageCache.delete(src);
        localStorage.setItem(
          IMAGE_CACHE_KEY,
          JSON.stringify(Array.from(memoryImageCache)),
        );
      };

      return;
    }

    setState({ isLoading: true, isError: false });

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (retryTimerRef.current) clearTimeout(retryTimerRef.current);

    const img = new window.Image();

    const handleLoad = () => {
      clearTimeout(timeoutRef.current!);
      clearTimeout(retryTimerRef.current!);
      setImageCache(src);
      setState({ isLoading: false, isError: false });
    };

    const handleError = () => {
      clearTimeout(timeoutRef.current!);
      setState({ isLoading: false, isError: true });

      retryTimerRef.current = setTimeout(() => {
        setRetryLoad((prev) => prev + 1);
      }, 5000);
    };

    timeoutRef.current = setTimeout(() => {
      handleError();
    }, timeout);

    img.onload = handleLoad;
    img.onerror = handleError;
    img.src = src;

    if (img.complete && img.naturalWidth !== 0) {
      clearTimeout(timeoutRef.current);
      clearTimeout(retryTimerRef.current!);
      setImageCache(src);
      setState({ isLoading: false, isError: false });
    }

    return () => {
      img.onload = null;
      img.onerror = null;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    };
  }, [src, timeout, retryLoad]);

  if (state.isLoading) {
    return (
      <>
        <CustomSkeleton
          startColor="dark.200"
          endColor="dark.500"
          w="full"
          h="full"
          position="absolute"
          top={0}
          left={0}
          zIndex={0}
        />
        <Center
          w="full"
          h="full"
          position="absolute"
          top={0}
          left={0}
          zIndex={1}
        >
          <Spinner thickness="3px" speed="0.5s" color="grey.400" size="md" />
        </Center>
      </>
    );
  }

  return (
    <Image
      w="full"
      h="full"
      src={state.isError ? fallback : src}
      alt="NFT"
      borderRadius={5}
      objectFit="cover"
      opacity={state.isLoading ? 0 : 1}
      transition="opacity 0.3s ease"
      position="absolute"
      top={0}
      left={0}
    />
  );
};
