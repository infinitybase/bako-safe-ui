import { Center, Image, Spinner } from '@chakra-ui/react';
import { CustomSkeleton } from '@/components';
import { useCachedImageLoader } from '../../hooks/useCachedImageLoader';

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
  const { isLoading, isError, srcToRender } = useCachedImageLoader(
    src,
    fallback,
  );

  if (isLoading) {
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
      src={srcToRender}
      alt="NFT"
      borderRadius={5}
      objectFit="cover"
      opacity={isLoading ? 0 : 1}
      transition="opacity 0.3s ease"
      position="absolute"
      top={0}
      left={0}
    />
  );
};
