import { useMediaQuery } from 'bako-ui';

const useScreenSize = () => {
  // Widths
  const [isExtraLarge] = useMediaQuery(['(min-width: 85em)']); //1360px
  const [isLarge] = useMediaQuery(['(max-width: 84em)']); //1344px
  const [isMobile] = useMediaQuery(['(max-width: 62em)']); //992px
  const [isSmall] = useMediaQuery(['(max-width: 37.48em)']); //600px
  const [isLitteSmall] = useMediaQuery(['(max-width: 25em)']); //400px
  const [isExtraSmall] = useMediaQuery(['(max-width: 21em)']); //336px
  const [isLowerThanFourHundredAndThirty] = useMediaQuery([
    '(max-width: 27em)',
  ]);
  const [vaultRequiredSizeToColumnLayout] = useMediaQuery([
    '(max-width: 75.62em)',
  ]); //1210px

  const [isLargerThan1700] = useMediaQuery(['(min-width: 106.25em)']); //1700px
  const [isLargerThan1210] = useMediaQuery(['(min-width: 75.625em)']); //1210px
  const [isLargerThan680] = useMediaQuery(['(min-width: 42.5em)']); //680px

  // Heights
  const [isMdHeight] = useMediaQuery(['(max-height: 48em)']); //768px
  const [isSmallHeight] = useMediaQuery(['(max-height: 37.48em)']); //600px
  const [isXSHeight] = useMediaQuery(['(max-height: 33.125em)']); //530px
  const [isLargerThan600] = useMediaQuery(['(min-height: 600px)']);
  const [isLargerThan660] = useMediaQuery(['(min-height: 660px)']);
  const [isLargerThan768] = useMediaQuery(['(min-height: 768px)']);
  const [isLargerThan900] = useMediaQuery(['(min-height: 900px)']);

  const screenHeights = {
    isMdHeight,
    isSmallHeight,
    isXSHeight,
    isLargerThan600,
    isLargerThan660,
    isLargerThan768,
    isLargerThan900,
  };

  const isExtraSmallDevice = isMdHeight && isMobile;

  return {
    isLarge,
    isMobile,
    isSmall,
    isLitteSmall,
    vaultRequiredSizeToColumnLayout,
    isExtraSmall,
    isMdHeight,
    isSmallHeight,
    isXSHeight,
    isExtraSmallDevice,
    isExtraLarge,
    isLowerThanFourHundredAndThirty,
    isLargerThan1700,
    isLargerThan1210,
    isLargerThan680,
    screenHeights,
  };
};

export { useScreenSize };
