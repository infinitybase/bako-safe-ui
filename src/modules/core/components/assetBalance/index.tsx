import { Box, Card, Grid, GridItem, Heading, Skeleton, Text } from 'bako-ui';
import { useMemo } from 'react';

import AdvancedDonut from '@/components/chart/advanced-donut';
import { DonutColors } from '@/components/chart/color';
import { Asset, NFT } from '@/modules/core/utils';
import { useVaultAllocationRequest } from '@/modules/vault';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

import { useOrderAssetsByUSD } from '../../hooks';
import { AssetsBalanceCard } from './assets-balance-card';
import { NftBalanceCard } from './nfts-balance-card';

interface AssetsBalanceProps {
  assets: Asset[];
  predicateId: string;
}

interface NftsBalanceProps {
  nfts?: NFT[];
}

const AssetsBalanceList = ({ assets, predicateId }: AssetsBalanceProps) => {
  const { tokensUSD, assetsMap } = useWorkspaceContext();
  const { allocation, isLoading } = useVaultAllocationRequest(predicateId);

  const stableAssets = useMemo(() => assets, [assets]);
  const stableTokensUSD = useMemo(() => tokensUSD, [tokensUSD]);
  const stableAssetsMap = useMemo(() => assetsMap, [assetsMap]);

  const assetsOrdered = useOrderAssetsByUSD({
    assets: stableAssets,
    tokensUSD: stableTokensUSD.data,
    assetsMap: stableAssetsMap,
  });
  const data = useMemo(
    () =>
      allocation?.data.map((asset, i) => ({
        label: asset.assetId ? stableAssetsMap[asset.assetId]?.name : 'Other',
        value: asset.amountInUSD,
        percentage: asset.percentage,
        color: DonutColors[i % DonutColors.length], // Cycle through colors if more assets than colors
      })) ?? [],
    [allocation, stableAssetsMap],
  );

  const isEmpty = useMemo(() => data.length === 0, [data]);

  return (
    <Grid
      templateColumns={{
        base: '1fr',
        md: '1fr 3fr',
      }}
      gap={10}
    >
      <GridItem>
        <Card.Root variant="subtle" bg="bg.panel" rounded="2xl" h="full">
          <Card.Header>
            <Heading
              color="textPrimary"
              fontSize="sm"
              fontWeight="semibold"
              letterSpacing="wider"
            >
              Balance allocation
            </Heading>
          </Card.Header>
          <Card.Body justifyContent="center" alignItems="center">
            {!isEmpty && <AdvancedDonut data={data} />}

            {isEmpty && !isLoading && (
              <Text color="textSecondary" textAlign="center">
                Nothing to show here yet
              </Text>
            )}

            {isLoading && (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                w="full"
              >
                <Skeleton height="200px" w="200px" rounded="full" />
              </Box>
            )}
          </Card.Body>
        </Card.Root>
      </GridItem>
      <GridItem>
        <Grid
          gap={4}
          templateColumns={{
            base: 'repeat(1, 1fr)',
            // xs: 'repeat(2, 1fr)',
            sm: 'repeat(3, 1fr)',
            md: 'repeat(4, 1fr)',
            xl: 'repeat(5, 1fr)',
            '2xl': 'repeat(6, 1fr)',
          }}
        >
          {assetsOrdered?.map((assetOrdered) => {
            const asset = assetOrdered.asset;
            const usdData = tokensUSD.data[asset.assetId.toLowerCase()];
            const usdAmount = usdData?.usdAmount ?? null;
            return (
              <AssetsBalanceCard
                key={asset.assetId}
                asset={asset}
                usdAmount={usdAmount}
              />
            );
          })}
        </Grid>
      </GridItem>
    </Grid>
  );
};

const NftsBalanceList = ({ nfts }: NftsBalanceProps) => {
  return (
    <>
      <Grid
        gap={4}
        templateColumns={{
          base: 'repeat(2, 1fr)',
          // xs: 'repeat(3, 1fr)',
          sm: 'repeat(4, 1fr)',
          md: 'repeat(5, 1fr)',
          xl: 'repeat(5, 1fr)',
          '2xl': 'repeat(6, 1fr)',
        }}
      >
        {nfts?.map((nft) => (
          <NftBalanceCard key={nft.assetId} nft={nft} />
        ))}
      </Grid>
    </>
  );
};

export { AssetsBalanceList, NftsBalanceList };
