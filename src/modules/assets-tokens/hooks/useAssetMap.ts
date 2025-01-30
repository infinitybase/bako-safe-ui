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
      mappedTokens: {
        '0x1d5d97005e41cae2187a895fd8eab0506111e0e2f3331cd3912c15c24e3c1d82': {
          assetId:
            '0x1d5d97005e41cae2187a895fd8eab0506111e0e2f3331cd3912c15c24e3c1d82',
          name: 'Fuel',
          slug: 'FUEL',
          icon: 'https://verified-assets.fuel.network/images/fuel.svg',
          units: 18,
        },
        '0x324d0c35a4299ef88138a656d5272c5a3a9ccde2630ae055dacaf9d13443d53b': {
          assetId:
            '0x324d0c35a4299ef88138a656d5272c5a3a9ccde2630ae055dacaf9d13443d53b',
          name: 'Fuel',
          slug: 'FUEL',
          icon: 'https://verified-assets.fuel.network/images/fuel.svg',
          units: 18,
        },
      } as AssetMap,
      mappedNfts: {} as AssetMap,
      setAssetMap: (mappedTokens) => set({ mappedTokens }),
      getAssetByAssetId: (assetId) => get().mappedTokens[assetId],
      fetchAssets: async (assetIds, chainId) => {
        const assets: AssetMap = {};
        for (const assetId of assetIds) {
          let asset = get().mappedTokens[assetId];
          console.log('has asset?', !!asset, assetId);
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
          console.log('has asset?', !!asset, assetId);
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
      version: 2,
    },
  ),
);

export const useAssetMap = (chainId: number) => {
  const { mappedTokens } = useMappedAssetStore();

  const assetList = useMemo(() => {
    const tokenList = [
      ...Object.values(mappedTokens).map((item) => item),
      ...assets,
    ];
    return tokenList;
  }, [mappedTokens, chainId]);

  const assetsMap = useMemo(() => {
    return assetsMapFromFormattedFn(assetList as unknown as Assets, chainId);
  }, [assetList, chainId]);

  return { assetList, assetsMap };
};
