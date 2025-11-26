import { Assets, assets } from 'fuels';
import { useMemo } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { localStorageKeys } from '@/modules/auth/services/methods';
import {
  AssetMap,
  assetsMapFromFormattedFn,
} from '@/modules/core/utils/assets';
import { tokensIDS } from '@/modules/core/utils/assets/address';
import {
  formatMetadataFromIpfs,
  parseURI,
} from '@/modules/core/utils/formatter';
import { WorkspaceService } from '@/modules/workspace/services';
import { requestWithTimeout } from '@/utils/request';

type Store = {
  mappedTokens: AssetMap;
  mappedNfts: AssetMap;
  setAssetMap: (assetMap: AssetMap) => void;
  getAssetByAssetId: (assetId: string) => AssetMap[keyof AssetMap] | undefined;
  fetchAssets: (assetIds: string[], chainId: number) => Promise<AssetMap>;
  fetchNfts: (assetIds: string[], chainId: number) => Promise<AssetMap>;
};

export const useMappedAssetStore = create(
  persist<Store>(
    (set, get) => ({
      mappedTokens: {} as AssetMap,
      mappedNfts: {} as AssetMap,
      setAssetMap: (mappedTokens) => set({ mappedTokens }),
      getAssetByAssetId: (assetId) => get().mappedTokens[assetId],
      fetchAssets: async (assetIds, chainId) => {
        const cachedTokens = get().mappedTokens;

        // Separate cached and uncached assets
        const uncachedIds = assetIds.filter((id) => !cachedTokens[id]);
        const cachedAssets: AssetMap = {};

        // Get cached assets immediately
        for (const id of assetIds) {
          if (cachedTokens[id]) {
            cachedAssets[id] = cachedTokens[id];
          }
        }

        // Fetch uncached assets in parallel
        const fetchPromises = uncachedIds.map(async (assetId) => {
          try {
            const apiResponse = await WorkspaceService.getTokenFuelApi(
              assetId,
              chainId,
            );
            return { assetId, data: apiResponse };
          } catch {
            return { assetId, data: null };
          }
        });

        const results = await Promise.all(fetchPromises);
        const fetchedAssets: AssetMap = {};

        for (const { assetId, data } of results) {
          if (data) {
            fetchedAssets[assetId] = data;
          }
        }

        const allAssets = { ...cachedAssets, ...fetchedAssets };
        set({ mappedTokens: { ...cachedTokens, ...fetchedAssets } });
        return allAssets;
      },
      fetchNfts: async (assetIds, chainId) => {
        const cachedNfts = get().mappedNfts;

        // Separate cached and uncached NFTs
        const uncachedIds = assetIds.filter((id) => !cachedNfts[id]);
        const cachedAssets: AssetMap = {};

        // Get cached NFTs immediately
        for (const id of assetIds) {
          if (cachedNfts[id]) {
            cachedAssets[id] = cachedNfts[id];
          }
        }

        // Helper function to process a single NFT
        const processNft = async (
          assetId: string,
        ): Promise<{ assetId: string; data: AssetMap[''] | null }> => {
          try {
            const apiResponse = await WorkspaceService.getTokenFuelApi(
              assetId,
              chainId,
            );
            if (!apiResponse) {
              return { assetId, data: null };
            }

            let asset = apiResponse;
            const isNft =
              asset.isNFT ||
              asset?.totalSupply === '1' ||
              (asset?.totalSupply === null && !('rate' in asset));

            if (!isNft) {
              return { assetId, data: null };
            }

            const withNativeMetadata =
              Object.keys(asset.metadata || {}).filter(
                (metadata) => !['uri', 'image'].includes(metadata),
              ).length > 0;

            if (!withNativeMetadata && asset.metadata?.uri) {
              try {
                const data = await requestWithTimeout<Record<string, string>>(
                  parseURI(asset.metadata.uri),
                  3000,
                );
                if (data) {
                  const formattedMetadata = formatMetadataFromIpfs(data);
                  return {
                    assetId,
                    data: { ...asset, metadata: formattedMetadata },
                  };
                }
              } catch {
                // IPFS fetch failed, use fallback
              }
              return {
                assetId,
                data: {
                  ...asset,
                  metadata: {
                    ...asset.metadata,
                    ...(asset.description && { description: asset.description }),
                    ...(asset.name && { name: asset.name }),
                  },
                },
              };
            }

            return {
              assetId,
              data: {
                ...asset,
                metadata: formatMetadataFromIpfs(asset.metadata ?? {}),
              },
            };
          } catch {
            return { assetId, data: null };
          }
        };

        // Fetch uncached NFTs in parallel
        const results = await Promise.all(uncachedIds.map(processNft));
        const fetchedAssets: AssetMap = {};

        for (const { assetId, data } of results) {
          if (data) {
            fetchedAssets[assetId] = data;
          }
        }

        const allAssets = { ...cachedAssets, ...fetchedAssets };
        set({ mappedNfts: { ...cachedNfts, ...fetchedAssets } });
        return allAssets;
      },
    }),
    {
      name: localStorageKeys.FUEL_MAPPED_ASSETS,
      version: 0,
    },
  ),
);

export const getAssetInfo = (assetId: string) => {
  const state = useMappedAssetStore.getState();
  return state.mappedTokens[assetId] || state.mappedNfts[assetId];
};

export const useAssetMap = (chainId: number) => {
  const { mappedTokens, mappedNfts } = useMappedAssetStore();

  const assetList = useMemo(() => {
    const tokenList = [...Object.values(mappedTokens), ...assets];
    return tokenList;
  }, [mappedTokens]);

  const nftList = useMemo(() => {
    const tokens = new Set(Object.values(tokensIDS));

    const nfts = Object.values(mappedNfts)
      .filter((nft) => !tokens.has(nft.assetId))
      .map((nft) => ({
        ...nft,
        metadata: nft.metadata,
      }));

    return nfts;
  }, [mappedNfts]);

  const getAssetInfo = (assetId: string) => {
    return (
      assetsMap[assetId] ||
      mappedTokens[assetId] ||
      mappedNfts[assetId] ||
      assetsMap?.UNKNOWN
    );
  };

  const assetsMap = useMemo(() => {
    return assetsMapFromFormattedFn(assetList as unknown as Assets, chainId);
  }, [assetList, chainId]);

  return { assetList, nftList, assetsMap, getAssetInfo };
};

export type UseAssetMap = ReturnType<typeof useAssetMap>;
