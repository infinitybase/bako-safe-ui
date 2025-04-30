import { Center, Image, Spinner } from '@chakra-ui/react';
import { CustomSkeleton } from '@/components';

type NftImageProps = {
  loaded: boolean;
  src: string;
  fallback: string;
  setLoaded: (v: boolean) => void;
  setSrc: (v: string) => void;
};

export const NftImage = ({
  loaded,
  src,
  fallback,
  setLoaded,
  setSrc,
}: NftImageProps) => (
  <>
    {!loaded && (
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
    )}
    <Image
      w="full"
      h="full"
      src={src}
      alt="NFT"
      borderRadius={5}
      objectFit="cover"
      opacity={loaded ? 1 : 0}
      transition="opacity 0.3s ease"
      position="absolute"
      top={0}
      left={0}
      onLoad={() => setLoaded(true)}
      onError={() => {
        setLoaded(true);
        setSrc(fallback);
      }}
    />
  </>
);
