import { Center, Image, Spinner } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';

import { CustomSkeleton } from '@/components';

const DEFAULT_TIMEOUT = 6000;

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

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setState({ isLoading: true, isError: false });

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (!src?.trim()) {
      setState({ isLoading: false, isError: true });
      return;
    }

    const img = new window.Image();

    const handleLoad = () => {
      clearTimeout(timeoutRef.current!);
      setState({ isLoading: false, isError: false });
    };

    const handleError = () => {
      clearTimeout(timeoutRef.current!);
      setState({ isLoading: false, isError: true });
    };

    img.onload = handleLoad;
    img.onerror = handleError;

    timeoutRef.current = setTimeout(() => {
      handleError();
    }, timeout);

    img.src = src;

    if (img.complete) {
      clearTimeout(timeoutRef.current);
      handleLoad();
    }

    return () => {
      img.onload = null;
      img.onerror = null;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [src, timeout]);

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
    />
  );
};
