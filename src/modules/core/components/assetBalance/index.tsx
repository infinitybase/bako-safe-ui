import { Grid } from '@chakra-ui/react';
import { useMemo } from 'react';

import { Asset, NFT } from '@/modules/core/utils';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

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
  const grouped = useMemo(() => {
    if (!nfts) return {};
    return nfts.reduce<Record<string, typeof nfts>>((acc, nft) => {
      const isBakoId = nft.symbol === 'BID' || nft.collection === 'Bako ID';
      const isBKT = nft.symbol === 'BKT';
      const key = isBakoId
        ? 'Bako ID'
        : isBKT
          ? 'Bakteria'
          : (nft.collection ?? 'Other');
      (acc[key] ??= []).push(nft);
      return acc;
    }, {});
  }, [nfts]);

  const orderedGrouped = Object.entries(grouped).sort(([groupA], [groupB]) => {
    if (groupA === 'Bako ID') return 1;
    if (groupB === 'Bako ID') return -1;
    if (groupA === 'Other') return 1;
    if (groupB === 'Other') return -1;
    return groupA.localeCompare(groupB);
  });

  return (
    <>
      {orderedGrouped.map(([group, groupNfts]) => (
        <div key={group}>
          <h2 style={{ margin: '1rem 0' }}>
            {group === 'BID' ? 'Bako ID' : group}
          </h2>
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
            {groupNfts.map((nft) => (
              <NftBalanceCard key={nft.assetId} nft={nft} />
            ))}
          </Grid>
        </div>
      ))}
    </>
  );
};

export { AssetsBalanceList, NftsBalanceList };
