import { Grid } from 'bako-ui';
import { useMemo } from 'react';

import { Asset, NFT } from '@/modules/core/utils';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

import { useOrderAssetsByUSD } from '../../hooks';
import { AssetsBalanceCard } from './assets-balance-card';
import { NftBalanceCard } from './nfts-balance-card';

interface AssetsBalanceProps {
  assets: Asset[];
}

interface NftsBalanceProps {
  nfts?: NFT[];
}

const AssetsBalanceList = ({ assets }: AssetsBalanceProps) => {
  const { tokensUSD, assetsMap } = useWorkspaceContext();

  const stableAssets = useMemo(() => assets, [assets]);
  const stableTokensUSD = useMemo(() => tokensUSD, [tokensUSD]);
  const stableAssetsMap = useMemo(() => assetsMap, [assetsMap]);

  const assetsOrdered = useOrderAssetsByUSD({
    assets: stableAssets,
    tokensUSD: stableTokensUSD.data,
    assetsMap: stableAssetsMap,
  });

  return (
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
