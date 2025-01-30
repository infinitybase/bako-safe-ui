import { Assets, assets } from 'fuels';
import { useMemo } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { localStorageKeys } from '@/modules/auth/services/methods';
import {
  AssetMap,
  assetsMapFromFormattedFn,
} from '@/modules/core/utils/assets';
import { WorkspaceService } from '@/modules/workspace/services';

type Store = {
  mappedTokens: AssetMap;
  mappedNfts: AssetMap;
  setAssetMap: (assetMap: AssetMap) => void;
  getAssetByAssetId: (assetId: string) => AssetMap[keyof AssetMap] | undefined;
  fetchAssets: (assetIds: string[], chainId: number) => Promise<void>;
  fetchNfts: (assetIds: string[], chainId: number) => Promise<void>;
};

export const useMappedAssetStore = create(
  persist<Store>(
    (set, get) => ({
      mappedTokens: {} as AssetMap,
      mappedNfts: {} as AssetMap,
      setAssetMap: (mappedTokens) => set({ mappedTokens }),
      getAssetByAssetId: (assetId) => get().mappedTokens[assetId],
      fetchAssets: async (assetIds, chainId) => {
        const assets: AssetMap = {};
        for (const assetId of assetIds) {
          let asset = get().mappedTokens[assetId];
          if (!asset) {
            asset = await WorkspaceService.getTokenFuelApi(assetId, chainId);
          }
          assets[assetId] = asset;
        }
        set({ mappedTokens: { ...get().mappedTokens, ...assets } });
      },
      fetchNfts: async (assetIds, chainId) => {
        const assets: AssetMap = {};
        for (const assetId of assetIds) {
          let asset = get().mappedNfts[assetId];
          if (!asset) {
            asset = await WorkspaceService.getTokenFuelApi(assetId, chainId);
          }
          assets[assetId] = asset;
        }
        set({ mappedNfts: { ...get().mappedNfts, ...assets } });
      },
    }),
    {
      name: localStorageKeys.FUEL_MAPPED_ASSETS,
      version: 0,
    },
  ),
);

export const useAssetMap = (chainId: number) => {
  const { mappedTokens } = useMappedAssetStore();

  const assetList = useMemo(() => {
    const tokenList = [
      ...assets,
      ...Object.values(mappedTokens).map((item) => item),
    ];
    return tokenList;
  }, [mappedTokens, chainId]);

  const assetsMap = useMemo(() => {
    return assetsMapFromFormattedFn(assetList as unknown as Assets, chainId);
  }, [assetList, chainId]);

  return { assetList, assetsMap };
};
