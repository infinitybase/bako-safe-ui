import { HStack, Image, Text, VStack } from '@chakra-ui/react';
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

const AmountDetails = (props: AmountDetailsProps) => {
  const { assets } = props;
  const isBig = assets?.value ? formatList(assets.value) : 0;

  return (
    <VStack w="25%" justifyContent="start" alignItems="center" minH="475" p={2}>
      <HStack w="full" mb={1}>
        <Text color="grey.200" fontWeight="semibold" fontSize="20px">
          Balance
        </Text>
      </HStack>
      {assets?.value &&
        assets.value.map((asset: Asset, index: number) => {
          if (isBig > 0 && index > 3) return;
          if (isBig > 0 && index == 3) {
            return (
              <Card
                key={index}
                w="full"
                h="85"
                p={2}
                display="flex"
                alignItems="center"
                mb={2}
                borderStyle="dashed"
              >
                <HStack
                  w="100%"
                  spacing={0}
                  justifyContent="center"
                  alignItems="center"
                  display="flex"
                  flexDirection="column"
                  cursor="pointer"
                >
                  <Text variant="description" fontSize="20px" fontWeight="bold">
                    +{isBig + 1}
                  </Text>
                  <Text variant="description" fontSize="15px">
                    View all
                  </Text>
                </HStack>
              </Card>
            );
          }
          return (
            <Card
              key={index}
              w="full"
              h="85"
              p={2}
              display="flex"
              alignItems="center"
              mb={2}
            >
              <HStack w="30%" justifyContent="center">
                <Image src={assetsMap[asset.assetId].icon} boxSize={12} />
              </HStack>
              <HStack w="70%" display="flex" justifyContent="flex-start">
                <VStack justifyContent="flex-start" alignItems="start">
                  <Text color="grey.200" fontWeight="semibold" fontSize="20px">
                    {asset.amount}
                  </Text>
                  <Text variant="description" fontSize="20px">
                    {assetsMap[asset.assetId].slug}
                  </Text>
                </VStack>
              </HStack>
            </Card>
          );
        })}
    </VStack>
  );
};

export { AmountDetails };
