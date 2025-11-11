import { Box, BoxProps, Icon, Image, Stack, Text } from 'bako-ui';

import MarketplaceBanner from '@/assets/bako-id-marketplace-banner.png';

import { BakoIdIcon } from '../icons';

export const BakoMarketplaceBanner = ({ ...rest }: BoxProps) => {
  return (
    <Box position="relative" {...rest}>
      <Box
        position="absolute"
        left={4}
        top="50%"
        transform="translateY(-50%)"
        display="flex"
        flexDir="column"
        justifyContent="space-between"
        gap={4}
      >
        <Stack>
          <Text fontWeight={700} fontSize="md">
            Your NFTs
          </Text>
          <Text fontSize="sm" color="grey.75" lineHeight="none">
            On the market
          </Text>
        </Stack>

        <Icon as={BakoIdIcon} width="60px" height="24px" />
      </Box>
      <Image
        src={MarketplaceBanner}
        alt="Bako Marketplace Banner"
        borderRadius="lg"
        width="full"
        height="101px"
      />
    </Box>
  );
};
