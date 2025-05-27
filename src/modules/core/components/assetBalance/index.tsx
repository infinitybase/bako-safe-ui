import { Grid } from '@chakra-ui/react';
import { useMemo } from 'react';

import { Asset, NFT } from '@/modules/core/utils';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { AssetsBalanceCard } from './assets-balance-card';
import { NftBalanceCard } from './nfts-balance-card';

interface AssetsBalanceProps {
  assets: Asset[];
}

interface NftsBalanceProps {
  nfts?: NFT[];
}

const AssetsBalanceList = ({ assets }: AssetsBalanceProps) => {
  const { tokensUSD } = useWorkspaceContext();
  return (
    <Grid
      gap={4}
      templateColumns={{
        base: 'repeat(1, 1fr)',
        xs: 'repeat(2, 1fr)',
        sm: 'repeat(3, 1fr)',
        md: 'repeat(4, 1fr)',
        xl: 'repeat(5, 1fr)',
        '2xl': 'repeat(6, 1fr)',
      }}
    >
      {assets?.map((asset) => {
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
      const key = isBakoId ? 'Bako ID' : (nft.collection ?? 'Other');
      (acc[key] ??= []).push(nft);
      return acc;
    }, {});
  }, [nfts]);

  return (
    <>
      {Object.entries(grouped).map(([group, groupNfts]) => (
        <div key={group}>
          <h2 style={{ margin: '1rem 0' }}>
            {group === 'BID' ? 'Bako ID' : group}
          </h2>
          <Grid
            gap={4}
            templateColumns={{
              base: 'repeat(2, 1fr)',
              xs: 'repeat(3, 1fr)',
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
