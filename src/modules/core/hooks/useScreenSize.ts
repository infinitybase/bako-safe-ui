import { useMediaQuery } from '@chakra-ui/react';

const useScreenSize = () => {
  const [isMobile] = useMediaQuery('(max-width: 62em)');

  return {
    isMobile,
  };
};

export { useScreenSize };
