import { Flex, Image } from '@chakra-ui/react';

import bakoLoadingGif from '@/assets/bako-loading-gif/Loading-Fill-White.gif';

const BakoLoading = () => {
  return (
    <Flex alignItems="center" justifyContent="center" w="full">
      <Image
        src={bakoLoadingGif}
        alt="Animated loading component"
        width={{ base: '30%', xs: '15%', sm: '10%' }}
      />
    </Flex>
  );
};

export { BakoLoading };
