import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { getChainId } from '@/modules/core';

import { useMappedAssetStore } from './useAssetMap';

// Cache asset metadata for 10 minutes
const ASSET_METADATA_STALE_TIME = 10 * 60 * 1000;

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
    staleTime: ASSET_METADATA_STALE_TIME,
    refetchOnWindowFocus: false,
  });

  return { asset, ...rest };
};
