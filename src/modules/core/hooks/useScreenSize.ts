import { useMediaQuery } from '@chakra-ui/react';

const useScreenSize = () => {
  const [vaultRequiredSizeToColumnLayout] = useMediaQuery(
    '(max-width: 75.62em)',
  ); //1210px

  const [isMobile] = useMediaQuery('(max-width: 62em)'); //992px
  const [isLargerThan1360] = useMediaQuery('(min-width: 85em)');
  const [isSmallerThan1344] = useMediaQuery('(max-width: 84em)');
  const [isSmallerThan600] = useMediaQuery('(max-width: 37.48em)');
  const [isSmallerThan430] = useMediaQuery('(max-width: 27em)');
  const [isSmallerThan400] = useMediaQuery('(max-width: 25em)');
  const [isSmallerThan336] = useMediaQuery('(max-width: 21em)');

  // Heights
  const [isShorterThan768] = useMediaQuery('(max-height: 48em)');
  const [isShorterThan600] = useMediaQuery('(max-height: 37.48em)');
  const [isShorterThan530] = useMediaQuery('(max-height: 33.125em)');
  const [isLargerThan600] = useMediaQuery('(min-height: 600px)');
  const [isLargerThan660] = useMediaQuery('(min-height: 660px)');
  const [isLargerThan768] = useMediaQuery('(min-height: 768px)');
  const [isLargerThan900] = useMediaQuery('(min-height: 900px)');

  const screenHeights = {
    isShorterThan768,
    isShorterThan600,
    isShorterThan530,
    isLargerThan600,
    isLargerThan660,
    isLargerThan768,
    isLargerThan900,
  };

  const screenWidths = {
    isLargerThan1360,
    isSmallerThan1344,
    isSmallerThan600,
    isSmallerThan430,
    isSmallerThan400,
    isSmallerThan336,
  };

  const isExtraSmallDevice = isShorterThan768 && isMobile;

  return {
    isMobile,
    vaultRequiredSizeToColumnLayout,
    screenWidths,
    isExtraSmallDevice,
    screenHeights,
  };
};

export { useScreenSize };
