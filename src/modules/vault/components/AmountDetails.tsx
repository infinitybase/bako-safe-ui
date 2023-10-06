import { HStack, Image, Text, VStack } from '@chakra-ui/react';
import { bn, CoinQuantity } from 'fuels';
import React from 'react';

import { Card } from '@/components';

import { assetsList, assetsMap } from '../../core/utils/assets/data';

const assets: CoinQuantity[] = [
  {
    amount: bn(1_000_000_000),
    assetId: assetsList[0].assetId,
  },
  {
    amount: bn(5_000),
    assetId: assetsList[1].assetId,
  },
  {
    amount: bn(1_000_000),
    assetId: assetsList[2].assetId,
  },
  {
    amount: bn(1_000_5),
    assetId: assetsList[0].assetId,
  },
  {
    amount: bn(1_000_5),
    assetId: assetsList[0].assetId,
  },
  {
    amount: bn(1_000_5),
    assetId: assetsList[0].assetId,
  },
];

const formatList = (list: CoinQuantity[]) => {
  return list.length - 4;
};
const isBig = formatList(assets);
const AmountDetails = () => {
  return (
    <VStack w="25%" justifyContent="start" alignItems="center" minH="475" p={2}>
      <HStack w="full" mb={1}>
        <Text color="grey.200" fontWeight="semibold" fontSize="20px">
          Balance
        </Text>
      </HStack>
      {assets.map((asset: CoinQuantity, index: number) => {
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
                  {asset.amount.format().toString()}
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
