import { useQuery } from '@tanstack/react-query';

import { useMappedAssetStore } from '@/modules/assets-tokens/hooks/useAssetMap';
import { localStorageKeys } from '@/modules/auth';
import { Asset } from '@/modules/core';

export const useGetAssetsMetadata = (assets: string[]) => {
  const assetStore = useMappedAssetStore();
  const chainId =
    Number(window.localStorage.getItem(localStorageKeys.SELECTED_CHAIN_ID)) ??
    9889;

  const { data, ...rest } = useQuery({
    queryKey: ['assetsMetadata', assets],
    queryFn: async () => {
      const nfts = await assetStore.fetchNfts(assets, chainId);
      const tokens = await assetStore.fetchAssets(assets, chainId);
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
  });

  return { assets: data, ...rest };
};
