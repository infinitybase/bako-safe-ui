import { Box, Center, Image, ImageProps, Loader, Skeleton } from 'bako-ui';
import { useEffect, useRef, useState } from 'react';

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
  ...rest
}: NftImageProps & ImageProps) => {
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
      <Box w="full" h="full" position="relative">
        <Skeleton w="full" h="full" borderTopRadius="16px" />
        <Center
          w="full"
          h="full"
          position="absolute"
          top={0}
          left={0}
          zIndex={1}
        >
          <Loader
            borderWidth="3px"
            animationDelay="0.5s"
            color="grey.400"
            size="md"
          />
        </Center>
      </Box>
    );
  }

  return (
    <Image
      w="full"
      h="full"
      src={state.isError ? fallback : src}
      alt="NFT"
      className="nftImage"
      objectFit="cover"
      opacity={state.isLoading ? 0 : 1}
      transition="all 0.3s ease"
      {...rest}
    />
  );
};
