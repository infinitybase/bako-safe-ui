import { Grid } from '@chakra-ui/react';
import { useEffect, useMemo } from 'react';

import { Asset, NFT } from '@/modules/core/utils';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { useScreenSize } from '../../hooks';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { useLocalSimplePagination } from '../../hooks/useLocalSimplePagination';
import { useLocalGroupedPagination } from '../../hooks/useLocalGroupedPagination';

import { AssetsBalanceCard } from './assets-balance-card';
import { NftBalanceCard } from './nfts-balance-card';
import { useEnrichAssetOnVisible } from '@/modules/assets-tokens/hooks/useEnrichAssetOnVisible';
import { localStorageKeys } from '@/modules/auth/services/methods';

interface AssetsBalanceProps {
  assets: Asset[];
}

interface NftsBalanceProps {
  nfts?: NFT[];
}

const AssetsBalanceList = ({ assets }: AssetsBalanceProps) => {
  const { tokensUSD } = useWorkspaceContext();
  const {
    visibleData: visibleAssets,
    loadMore,
    hasMore,
  } = useLocalSimplePagination(assets, 20);
  const { refCallback, visibleEntries } = useIntersectionObserver();

  useEffect(() => {
    if (!hasMore) return;

    const lastEntry = visibleEntries[visibleEntries.length - 1];

    if (lastEntry?.isIntersecting) {
      loadMore();
    }
  }, [visibleEntries, loadMore, hasMore]);

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
      {visibleAssets?.map((asset, index) => {
        const usdData = tokensUSD.data[asset.assetId.toLowerCase()];
        const usdAmount = usdData?.usdAmount ?? null;
        return (
          <AssetsBalanceCard
            key={asset.assetId}
            asset={asset}
            usdAmount={usdAmount}
            ref={index === visibleAssets.length - 1 ? refCallback : undefined}
          />
        );
      })}
    </Grid>
  );
};

const NftsBalanceList = ({ nfts }: NftsBalanceProps) => {
  const { isLitteSmall } = useScreenSize();
  const { refCallback, visibleEntries } = useIntersectionObserver();

  // Group nfts by collection
  const grouped = useMemo(() => {
    if (!nfts) return {};
    return nfts.reduce<Record<string, NFT[]>>((acc, nft) => {
      const isBakoId = nft.symbol === 'BID' || nft.collection === 'Bako ID';
      const key = isBakoId ? 'Bako ID' : (nft.collection ?? 'Other');
      (acc[key] ??= []).push(nft);
      return acc;
    }, {});
  }, [nfts]);

  // Paginate nfts by collection
  const {
    visibleData: visibleNFTS,
    flatVisibleItem,
    loadMore,
    hasMore,
  } = useLocalGroupedPagination(grouped ?? [], ['Bako ID', 'Other'], 20);

  const chainId =
    Number(window.localStorage.getItem(localStorageKeys.SELECTED_CHAIN_ID)) ??
    0;

  const enrichedNfts = useEnrichAssetOnVisible();

  // Load more nfts on intersection
  useEffect(() => {
    if (!hasMore) return;

    const lastEntry = visibleEntries[visibleEntries.length - 1];

    if (lastEntry?.isIntersecting) {
      loadMore();
    }

    if (flatVisibleItem.length) {
      enrichedNfts({
        visibleAssetIds: flatVisibleItem.map((item) => item.assetId),
        chainId,
        type: 'nft',
      });
    }
  }, [visibleEntries, loadMore, hasMore, flatVisibleItem]);

  return (
    <>
      {Object.entries(visibleNFTS).map(([group, groupNfts]) => (
        <div key={group}>
          <h2 style={{ margin: '1rem 0' }}>
            {group === 'BID' ? 'Bako ID' : group}
          </h2>
          <Grid
            gap={4}
            templateColumns={
              isLitteSmall
                ? 'repeat(2, 1fr)'
                : {
                    base: 'repeat(3, 1fr)',
                    xs: 'repeat(3, 1fr)',
                    sm: 'repeat(4, 1fr)',
                    md: 'repeat(5, 1fr)',
                    xl: 'repeat(5, 1fr)',
                    '2xl': 'repeat(6, 1fr)',
                  }
            }
          >
            {groupNfts.map((nft, index) => (
              <NftBalanceCard
                key={nft.assetId}
                nft={nft}
                ref={
                  index === flatVisibleItem.length - 1 ? refCallback : undefined
                }
              />
            ))}
          </Grid>
        </div>
      ))}
    </>
  );
};

export { AssetsBalanceList, NftsBalanceList };
