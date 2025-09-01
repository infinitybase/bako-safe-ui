import { Box, Image as ChakraImg, type ImageProps } from '@chakra-ui/react';
import { useMemo, useState } from 'react';

import { CustomSkeleton } from '@/components';
import EmptyImg from '/nft-empty.svg';

export const Image = ({ boxSize = { xl: '160px ' }, ...props }: ImageProps) => {
  const [status, setStatus] = useState<'loading' | 'error' | 'idle'>('loading');

  const handleOnLoad = () => {
    setStatus('idle');
  };

  const handleOnError = () => {
    setStatus('error');
  };

  const isLoading = useMemo(() => status === 'loading', [status]);
  const isError = useMemo(() => status === 'error', [status]);

  return (
    <Box borderTopRadius="lg">
      <CustomSkeleton
        isLoaded={!isLoading}
        startColor="dark.200"
        endColor="dark.500"
        w="full"
        h="full"
      >
        <ChakraImg
          onLoad={handleOnLoad}
          fallbackSrc={EmptyImg}
          onError={handleOnError}
          borderTopRadius="8px"
          aspectRatio="1/1"
          boxSize={boxSize}
          {...props}
          src={isError ? EmptyImg : props.src}
        />
      </CustomSkeleton>
    </Box>
  );
};
