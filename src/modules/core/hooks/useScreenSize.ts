import { useMediaQuery } from '@chakra-ui/react';

const useScreenSize = () => {
  const [isMobile] = useMediaQuery('(max-width: 62em)');
  const [isExtraSmall] = useMediaQuery('(max-width: 21em)'); //336 px
  const [vaultRequiredSizeToColumnLayout] = useMediaQuery(
    '(max-width: 75.62em)',
  ); //1029px

  return {
    isMobile,
    vaultRequiredSizeToColumnLayout,
    isExtraSmall,
  };
};

export { useScreenSize };
