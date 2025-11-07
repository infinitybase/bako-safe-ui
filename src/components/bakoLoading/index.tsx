import { Flex } from 'bako-ui';
import Lottie from 'lottie-react';

import bakoLoading from '@/assets/bako-loading/bako-loading.json';

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: bakoLoading,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

const BakoLoading = () => {
  return (
    <Flex alignItems="center" justifyContent="center" w="full" h="$100vh">
      <Lottie
        {...defaultOptions}
        size={20}
        style={{ height: '120px', width: '120px' }}
      />
    </Flex>
  );
};

export { BakoLoading };
