import {
  Box,
  Button,
  chakra,
  Heading,
  HStack,
  Image,
  Text,
  VStack,
} from '@chakra-ui/react';
import { bn } from 'fuels';

import { Card, CustomSkeleton, NotFoundIcon } from '@/components';

import { assetsMap } from '../../core/utils/assets/data';
import { Asset } from '../../core/utils/assets/types';
import { UseVaultDetailsReturn } from '../hooks/details';
import { openFaucet } from '../utils';

const formatList = (list: Asset[]) => {
  return list.length - 4;
};

export interface AmountDetailsProps {
  store: UseVaultDetailsReturn['store'];
  assets: UseVaultDetailsReturn['assets'];
  isLoading: boolean;
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
  const { store, assets, isLoading, vaultAddress } = props;
  const { visebleBalance } = store;

  const isBig = assets?.value ? formatList(assets.value) : 0;

  return (
    <Box w="full" maxW="205px">
      <Box mb={5} w="full">
        <Text color="grey.200" fontWeight="semibold" fontSize="20px">
          Balance
        </Text>
      </Box>
      <VStack spacing={5} justifyContent="space-between">
        {!assets.hasAssets && (
          <CustomSkeleton isLoaded={!assets.isLoadingAssets && !isLoading}>
            <AssetCard
              w="full"
              p={5}
              display="flex"
              justifyContent="center"
              flexDirection="column"
              alignItems="center"
              borderStyle="dashed"
              height="450px"
              // hidden={assets.hasAssets || assets.isLoadingAssets || isLoading}
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
                  To check your assets, start by using the faucet.
                </Text>
              </Box>
              <Button
                variant="primary"
                onClick={() => openFaucet(vaultAddress)}
              >
                Use the faucet
              </Button>
            </AssetCard>
          </CustomSkeleton>
        )}

        {assets?.value &&
          assets.value.map((asset: Asset, index: number) => {
            if (isBig > 0 && index > 3) return;
            if (isBig > 0 && index == 3) {
              return (
                <CustomSkeleton isLoaded={!isLoading} key={index}>
                  <AssetCard w="full" borderStyle="dashed">
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
                </CustomSkeleton>
              );
            }

            const balance = bn(bn.parseUnits(asset.amount ?? '0.000')).format({
              precision: 4,
            });

            return (
              <CustomSkeleton isLoaded={!isLoading} key={index}>
                <AssetCard>
                  <HStack w="full" spacing={4}>
                    <Image src={assetsMap[asset.assetId].icon} boxSize="38px" />
                    <Box>
                      <Text
                        color="grey.200"
                        fontWeight="semibold"
                        fontSize="lg"
                      >
                        {visebleBalance ? balance : '*****'}
                      </Text>
                      <Text variant="description" fontSize="md">
                        {assetsMap[asset.assetId].slug}
                      </Text>
                    </Box>
                  </HStack>
                </AssetCard>
              </CustomSkeleton>
            );
          })}
      </VStack>
    </Box>
  );
};

export { AmountDetails };
