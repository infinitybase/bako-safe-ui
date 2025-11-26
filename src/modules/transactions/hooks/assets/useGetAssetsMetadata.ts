import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { useMappedAssetStore } from '@/modules/assets-tokens/hooks/useAssetMap';
import { localStorageKeys } from '@/modules/auth';
import { Asset } from '@/modules/core';

// Cache asset metadata for 10 minutes
const ASSETS_METADATA_STALE_TIME = 10 * 60 * 1000;

export const useGetAssetsMetadata = (assets: string[]) => {
  const assetStore = useMappedAssetStore();
  const chainId =
    Number(window.localStorage.getItem(localStorageKeys.SELECTED_CHAIN_ID)) ??
    9889;

  // Stabilize query key by sorting the array
  const sortedAssets = useMemo(
    () => [...assets].sort(),
    [assets.join(',')],
  );

  const { data, ...rest } = useQuery({
    queryKey: ['assetsMetadata', sortedAssets],
    queryFn: async () => {
      // Fetch tokens and NFTs in parallel instead of sequentially
      const [tokens, nfts] = await Promise.all([
        assetStore.fetchAssets(assets, chainId),
        assetStore.fetchNfts(assets, chainId),
      ]);

      // Merge results - tokens take precedence over NFTs for non-NFT assets
      const store = {
        ...nfts,
        ...tokens,
      };

      const assetsWithMetadata = assets.reduce(
        (acc, assetId) => {
          const asset = store[assetId];
          if (asset) {
            acc[assetId] = asset;
          }
          return acc;
        },
        {} as Record<string, Asset>,
      );
      return assetsWithMetadata;
    },
    staleTime: ASSETS_METADATA_STALE_TIME,
    refetchOnWindowFocus: false,
  });

  return { assets: data, ...rest };
};
