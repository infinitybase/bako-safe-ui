import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { getChainId } from '@/modules/core';

import { useMappedAssetStore } from './useAssetMap';

export const useAssetMetadata = (assetId: string) => {
  const store = useMappedAssetStore();
  const chainId = useMemo(() => getChainId(), []);

  const { data: asset, ...rest } = useQuery({
    queryKey: ['assetMetadata', assetId],
    queryFn: async () => {
      const map = await store.fetchAssets([assetId], chainId);
      return map[assetId];
    },
    enabled: !!assetId,
    // Asset metadata is immutable on blockchain - never needs refetch
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  return { asset, ...rest };
};
