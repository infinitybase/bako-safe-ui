import { useMediaQuery } from '@chakra-ui/react';

const useScreenSize = () => {
  const [isMobile] = useMediaQuery('(max-width: 62em)'); //992px
  const [isSmall] = useMediaQuery('(max-width: 37.48em)'); //600px
  const [isExtraSmall] = useMediaQuery('(max-width: 21em)'); //336px
  const [vaultRequiredSizeToColumnLayout] = useMediaQuery(
    '(max-width: 75.62em)',
  ); //1029px

  const [isMdHeight] = useMediaQuery('(max-height: 48em)'); //768px
  const [isSmallHeight] = useMediaQuery('(max-height: 37.48em)'); //600px
  const [isSmHeight] = useMediaQuery('(max-height: 33.125em)'); //530px

  return {
    isMobile,
    isSmall,
    vaultRequiredSizeToColumnLayout,
    isExtraSmall,
    isMdHeight,
    isSmallHeight,
    isSmHeight,
  };
};

export { useScreenSize };
