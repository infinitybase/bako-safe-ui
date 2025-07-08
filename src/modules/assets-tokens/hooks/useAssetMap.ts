import { Assets, assets } from 'fuels';
import { useMemo } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { localStorageKeys } from '@/modules/auth/services/methods';
import {
  AssetMap,
  assetsMapFromFormattedFn,
} from '@/modules/core/utils/assets';
import {
  formatMetadataFromIpfs,
  parseURI,
} from '@/modules/core/utils/formatter';
import { WorkspaceService } from '@/modules/workspace/services';
import request from '@/utils/request';

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
            const apiResponse = await WorkspaceService.getTokenFuelApi(
              assetId,
              chainId,
            );
            if (apiResponse) {
              asset = apiResponse;
            }
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
            const apiResponse = await WorkspaceService.getTokenFuelApi(
              assetId,
              chainId,
            );
            if (apiResponse) {
              asset = apiResponse;
              if (
                asset.isNFT ||
                asset?.totalSupply === '1' ||
                asset?.totalSupply === null
              ) {
                const withNativeMetadata =
                  Object.keys(asset.metadata).filter(
                    (metadata) => !['uri', 'image'].includes(metadata),
                  ).length > 0;

                if (!withNativeMetadata && asset.metadata.uri) {
                  const data = await request<Record<string, string>>(
                    parseURI(asset.metadata.uri),
                  );
                  if (data) {
                    const formattedMetadata = formatMetadataFromIpfs(data);
                    assets[assetId] = { ...asset, metadata: formattedMetadata };
                  }
                } else {
                  assets[assetId] = {
                    ...asset,
                    metadata: formatMetadataFromIpfs(asset.metadata ?? {}),
                  };
                }
              }
            }
          }
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
