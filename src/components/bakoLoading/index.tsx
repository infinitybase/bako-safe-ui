import { Flex } from '@chakra-ui/react';
import Lottie from 'lottie-react';

import bakoLoading from '@/assets/bako-loading/bako-loading.json';

interface BakoLoadingProps {
  size?: number;
}

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: bakoLoading,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

const BakoLoading = ({ size }: BakoLoadingProps) => {
  return (
    <Flex alignItems="center" justifyContent="center" w="full" h="$100vh">
      <Lottie
        {...defaultOptions}
        style={{ height: `${size}px`, width: `${size}px` }}
      />
    </Flex>
  );
};

export { BakoLoading };
