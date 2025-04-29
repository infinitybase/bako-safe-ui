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
import { withConcurrencyLimit } from '@/modules/core/utils/concurrency';
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
        const idsToFetch = assetIds.filter((id) => !get().mappedNfts[id]);

        await withConcurrencyLimit(idsToFetch, 50, async (assetId) => {
          const asset = await WorkspaceService.getTokenFuelApi(
            assetId,
            chainId,
          );

          if (asset) {
            set((prev) => ({
              mappedTokens: {
                ...prev.mappedTokens,
                [assetId]: asset,
              },
            }));
          }
        });
      },
      fetchNfts: async (assetIds, chainId) => {
        const idsToFetch = assetIds.filter((id) => !get().mappedNfts[id]);
        const nftMap: AssetMap = {};

        await withConcurrencyLimit(idsToFetch, 50, async (assetId) => {
          const asset = await WorkspaceService.getTokenFuelApi(
            assetId,
            chainId,
          );

          if (
            asset &&
            (asset.isNFT ||
              asset.totalSupply === '1' ||
              asset.totalSupply === null)
          ) {
            nftMap[assetId] = asset;
          }

          set((prev) => ({
            mappedNfts: {
              ...prev.mappedNfts,
              ...nftMap,
            },
          }));
        });
      },
    }),
    {
      name: localStorageKeys.FUEL_MAPPED_ASSETS,
      version: 0,
    },
  ),
);

export const useAssetMap = (chainId: number) => {
  const { mappedTokens, mappedNfts } = useMappedAssetStore();

  const assetList = useMemo(() => {
    const tokenList = [...Object.values(mappedTokens), ...assets];
    return tokenList;
  }, [mappedTokens]);

  const nftList = useMemo(() => {
    const tokenList = [
      ...Object.values(mappedNfts).map((nft) => ({
        ...nft,
        metadata: nft.metadata,
      })),
    ];
    return tokenList;
  }, [mappedNfts]);

  const assetsMap = useMemo(() => {
    return assetsMapFromFormattedFn(assetList as unknown as Assets, chainId);
  }, [assetList, chainId]);

  return { assetList, nftList, assetsMap };
};

export type UseAssetMap = ReturnType<typeof useAssetMap>;
