import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { getChainId } from '@/modules/core';

import { useMappedAssetStore } from './useAssetMap';

export const useAssetMetadata = (assetId: string) => {
  const store = useMappedAssetStore();
  const chainId = useMemo(() => getChainId(), []);

  // Get cached data from Zustand - prevents unnecessary API calls
  const cachedData = store.mappedTokens[assetId] || store.mappedNfts[assetId];
  const hasCachedData = !!cachedData;

  const { data: asset, ...rest } = useQuery({
    queryKey: ['assetMetadata', assetId],
    queryFn: async () => {
      const map = await store.fetchAssets([assetId], chainId);
      return map[assetId];
    },
    enabled: !!assetId && !hasCachedData,
    initialData: cachedData,
    // Asset metadata is immutable on blockchain - never needs refetch
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  return { asset: asset ?? cachedData, ...rest };
};
