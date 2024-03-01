import { useMediaQuery } from '@chakra-ui/react';

const useScreenSize = () => {
  const [isMobile] = useMediaQuery('(max-width: 30em)');

  return {
    isMobile,
  };
};

export { useScreenSize };
