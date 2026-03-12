import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { useMappedAssetStore } from '@/modules/assets-tokens/hooks/useAssetMap';
import { localStorageKeys } from '@/modules/auth';
import { Asset } from '@/modules/core';

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

  // Check if all assets are already cached - prevents unnecessary API calls
  const cachedData = useMemo(() => {
    const result: Record<string, Asset> = {};
    let allCached = true;

    for (const assetId of assets) {
      const cached =
        assetStore.mappedTokens[assetId] || assetStore.mappedNfts[assetId];
      if (cached) {
        result[assetId] = cached;
      } else {
        allCached = false;
      }
    }

    return allCached && assets.length > 0 ? result : undefined;
  }, [assets, assetStore.mappedTokens, assetStore.mappedNfts]);

  const hasCachedData = !!cachedData;

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
    enabled: !hasCachedData,
    initialData: cachedData,
    // Asset metadata is immutable on blockchain - never needs refetch
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  return { assets: data ?? cachedData, ...rest };
};
