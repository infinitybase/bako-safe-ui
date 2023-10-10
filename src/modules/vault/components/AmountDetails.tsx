import { Box, chakra, HStack, Image, Text, VStack } from '@chakra-ui/react';
import React from 'react';

import { Card } from '@/components';

import { assetsMap } from '../../core/utils/assets/data';
import { Asset } from '../../core/utils/assets/types';
import { UseVaultDetailsReturn } from '../hooks/details';

const formatList = (list: Asset[]) => {
  return list.length - 4;
};

export interface AmountDetailsProps {
  assets: UseVaultDetailsReturn['assets'];
}

const AssetCard = chakra(Card, {
  baseStyle: {
    w: 'full',
    py: 5,
    px: 6,
    bgColor: 'dark.300',
  },
});

const AmountDetails = (props: AmountDetailsProps) => {
  const { assets } = props;
  const isBig = assets?.value ? formatList(assets.value) : 0;

  return (
    <Box w="full" maxW="205px">
      <Box mb={5} w="full">
        <Text color="grey.200" fontWeight="semibold" fontSize="20px">
          Balance
        </Text>
      </Box>
      <VStack justifyContent="space-between">
        {assets?.value &&
          assets.value.map((asset: Asset, index: number) => {
            if (isBig > 0 && index > 3) return;
            if (isBig > 0 && index == 3) {
              return (
                <AssetCard key={index} w="full">
                  <HStack
                    w="100%"
                    spacing={0}
                    justifyContent="center"
                    alignItems="center"
                    display="flex"
                    flexDirection="column"
                    cursor="pointer"
                  >
                    <Text
                      variant="description"
                      fontSize="20px"
                      fontWeight="bold"
                    >
                      +{isBig + 1}
                    </Text>
                    <Text variant="description" fontSize="15px">
                      View all
                    </Text>
                  </HStack>
                </AssetCard>
              );
            }
            return (
              <AssetCard key={index}>
                <HStack w="full" spacing={4}>
                  <Image src={assetsMap[asset.assetId].icon} boxSize="38px" />
                  <Box>
                    <Text color="grey.200" fontWeight="semibold" fontSize="lg">
                      {asset.amount}
                    </Text>
                    <Text variant="description" fontSize="md">
                      {assetsMap[asset.assetId].slug}
                    </Text>
                  </Box>
                </HStack>
              </AssetCard>
            );
          })}
      </VStack>
    </Box>
  );
};

export { AmountDetails };
