import { useMediaQuery } from '@chakra-ui/react';

const useScreenSize = () => {
  const [isMobile] = useMediaQuery('(max-width: 62em)');
  const [vaultRequiredSizeToColumnLayout] = useMediaQuery(
    '(max-width: 75.62em)',
  );

  return {
    isMobile,
    vaultRequiredSizeToColumnLayout,
  };
};

export { useScreenSize };
