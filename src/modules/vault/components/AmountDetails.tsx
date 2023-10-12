import {
  Box,
  Button,
  chakra,
  Heading,
  HStack,
  Image,
  Skeleton,
  Text,
  VStack,
} from '@chakra-ui/react';
import { bn } from 'fuels';

import { Card, NotFoundIcon } from '@/components';

import { assetsMap } from '../../core/utils/assets/data';
import { Asset } from '../../core/utils/assets/types';
import { UseVaultDetailsReturn } from '../hooks/details';
import { openFaucet } from '../utils';

const formatList = (list: Asset[]) => {
  return list.length - 4;
};

export interface AmountDetailsProps {
  assets: UseVaultDetailsReturn['assets'];
  vaultAddress: string;
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
  const { assets, vaultAddress } = props;
  const isBig = assets?.value ? formatList(assets.value) : 0;

  return (
    <Box w="full" maxW="205px">
      <Box mb={5} w="full">
        <Text color="grey.200" fontWeight="semibold" fontSize="20px">
          Balance
        </Text>
      </Box>
      <VStack spacing={5} justifyContent="space-between">
        <AssetCard
          w="full"
          p={5}
          display="flex"
          justifyContent="center"
          flexDirection="column"
          alignItems="center"
          borderStyle="dashed"
          height="450px"
          hidden={assets.hasAssets || assets.isLoadingAssets}
        >
          <Box mb={6}>
            <NotFoundIcon w={70} h={70} />
          </Box>
          <Box mb={5}>
            <Heading color="grey.200" variant="title-xl">
              No assets
            </Heading>
          </Box>
          <Box mb={8}>
            <Text
              textAlign="center"
              color="grey.200"
              fontSize="sm"
              fontWeight="medium"
            >
              Make your first deposit to see your assets here
            </Text>
          </Box>
          <Button variant="primary" onClick={() => openFaucet(vaultAddress)}>
            Make a deposit
          </Button>
        </AssetCard>

        <Skeleton
          w="full"
          h={93}
          startColor="dark.100"
          endColor="dark.300"
          borderRadius={10}
          hidden={!assets.isLoadingAssets}
        />

        {assets?.value &&
          assets.value.map((asset: Asset, index: number) => {
            if (isBig > 0 && index > 3) return;
            if (isBig > 0 && index == 3) {
              return (
                <AssetCard key={index} w="full" borderStyle="dashed">
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

            const balance = bn(bn.parseUnits(asset.amount ?? '0.000')).format({
              precision: 4,
            });

            return (
              <AssetCard key={index}>
                <HStack w="full" spacing={4}>
                  <Image src={assetsMap[asset.assetId].icon} boxSize="38px" />
                  <Box>
                    <Text color="grey.200" fontWeight="semibold" fontSize="lg">
                      {balance}
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
