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
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { Asset } from '../../core/utils/assets/types';
import { UseVaultDetailsReturn } from '../hooks/details';
import { openFaucet } from '../utils';

const formatList = (list: Asset[]) => {
  return list.length - 4;
};

export interface AmountDetailsProps {
  assets: UseVaultDetailsReturn['assets'];
  isLoading: boolean;
  vaultAddress: string;
}

const AssetCard = chakra(Card, {
  base: {
    w: 'full',
    py: 5,
    px: 6,
    bgColor: 'dark.300',
  },
});

const AmountDetails = (props: AmountDetailsProps) => {
  const { assetsMap } = useWorkspaceContext();
  const { assets, isLoading, vaultAddress } = props;
  const { visibleBalance } = assets;

  const isBig = assets?.assets ? formatList(assets.assets) : 0;

  return (
    <Box w="full" maxW="205px">
      <Box mb={5} w="full">
        <Text color="grey.200" fontWeight="semibold" fontSize="20px">
          Balance
        </Text>
      </Box>
      <VStack gap={5} justifyContent="space-between">
        {!assets.hasAssets && (
          <CustomSkeleton loading={isLoading}>
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
                <Heading color="grey.200">No assets</Heading>
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
                colorPalette="primary"
                onClick={() => openFaucet(vaultAddress)}
              >
                Use the faucet
              </Button>
            </AssetCard>
          </CustomSkeleton>
        )}

        {assets?.assets &&
          assets.assets.map((asset: Asset, index: number) => {
            if (isBig > 0 && index > 3) return;
            if (isBig > 0 && index == 3) {
              return (
                <CustomSkeleton loading={isLoading} key={index}>
                  <AssetCard w="full" borderStyle="dashed">
                    <HStack
                      w="100%"
                      gap={0}
                      justifyContent="center"
                      alignItems="center"
                      display="flex"
                      flexDirection="column"
                      cursor="pointer"
                    >
                      <Text
                        // variant="description"
                        fontSize="20px"
                        fontWeight="bold"
                      >
                        +{isBig + 1}
                      </Text>
                      <Text fontSize="15px">View all</Text>
                    </HStack>
                  </AssetCard>
                </CustomSkeleton>
              );
            }

            const balance = bn(bn.parseUnits(asset.amount ?? '0.000'))?.format({
              precision: 4,
            });

            return (
              <CustomSkeleton loading={isLoading} key={index}>
                <AssetCard>
                  <HStack w="full" gap={4}>
                    {/* This code is probably not being used, just to fix a build issue */}
                    <Image
                      w={{ base: 8, sm: 10 }}
                      h={{ base: 8, sm: 10 }}
                      src={assetsMap?.[asset.assetId]?.icon ?? ''}
                      borderRadius={100}
                      alt="Asset Icon"
                      objectFit="cover"
                    />
                    <Box>
                      <Text
                        color="grey.200"
                        fontWeight="semibold"
                        fontSize="lg"
                      >
                        {visibleBalance ? balance : '*****'}
                      </Text>
                      <Text fontSize="md">
                        {assetsMap?.[asset.assetId].slug}
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
