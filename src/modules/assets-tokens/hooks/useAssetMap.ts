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

// Request deduplication - prevents multiple simultaneous requests for the same asset
const pendingTokenRequests: Map<string, Promise<AssetMap[''] | null>> = new Map();
const pendingNftRequests: Map<string, Promise<AssetMap[''] | null>> = new Map();

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

        // Separate cached and uncached assets (also check pending requests)
        const uncachedIds = assetIds.filter(
          (id) => !cachedTokens[id] && !pendingTokenRequests.has(id),
        );
        const cachedAssets: AssetMap = {};

        // Get cached assets immediately
        for (const id of assetIds) {
          if (cachedTokens[id]) {
            cachedAssets[id] = cachedTokens[id];
          }
        }

        // Wait for any pending requests for assets we need
        const pendingPromises: Promise<{ assetId: string; data: AssetMap[''] | null }>[] = [];
        for (const id of assetIds) {
          const pending = pendingTokenRequests.get(id);
          if (pending && !cachedTokens[id]) {
            pendingPromises.push(pending.then((data) => ({ assetId: id, data })));
          }
        }

        // Fetch uncached assets in parallel with deduplication
        const fetchPromises = uncachedIds.map(async (assetId) => {
          const requestPromise = (async () => {
            try {
              const apiResponse = await WorkspaceService.getTokenFuelApi(
                assetId,
                chainId,
              );
              return apiResponse;
            } catch {
              return null;
            } finally {
              // Remove from pending after completion
              pendingTokenRequests.delete(assetId);
            }
          })();

          // Register this request as pending
          pendingTokenRequests.set(assetId, requestPromise);

          const data = await requestPromise;
          return { assetId, data };
        });

        // Wait for both new fetches and pending requests
        const [newResults, pendingResults] = await Promise.all([
          Promise.all(fetchPromises),
          Promise.all(pendingPromises),
        ]);

        const allResults = [...newResults, ...pendingResults];
        const fetchedAssets: AssetMap = {};

        for (const { assetId, data } of allResults) {
          if (data) {
            fetchedAssets[assetId] = data;
          }
        }

        const allAssets = { ...cachedAssets, ...fetchedAssets };
        set({ mappedTokens: { ...get().mappedTokens, ...fetchedAssets } });
        return allAssets;
      },
      fetchNfts: async (assetIds, chainId) => {
        const cachedNfts = get().mappedNfts;

        // Separate cached and uncached NFTs (also check pending requests)
        const uncachedIds = assetIds.filter(
          (id) => !cachedNfts[id] && !pendingNftRequests.has(id),
        );
        const cachedAssets: AssetMap = {};

        // Get cached NFTs immediately
        for (const id of assetIds) {
          if (cachedNfts[id]) {
            cachedAssets[id] = cachedNfts[id];
          }
        }

        // Wait for any pending requests for NFTs we need
        const pendingPromises: Promise<{ assetId: string; data: AssetMap[''] | null }>[] = [];
        for (const id of assetIds) {
          const pending = pendingNftRequests.get(id);
          if (pending && !cachedNfts[id]) {
            pendingPromises.push(pending.then((data) => ({ assetId: id, data })));
          }
        }

        // Helper function to process a single NFT with deduplication
        const processNft = async (
          assetId: string,
        ): Promise<{ assetId: string; data: AssetMap[''] | null }> => {
          const requestPromise = (async (): Promise<AssetMap[''] | null> => {
            try {
              const apiResponse = await WorkspaceService.getTokenFuelApi(
                assetId,
                chainId,
              );
              if (!apiResponse) {
                return null;
              }

              let asset = apiResponse;
              const isNft =
                asset.isNFT ||
                asset?.totalSupply === '1' ||
                (asset?.totalSupply === null && !('rate' in asset));

              if (!isNft) {
                return null;
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
                    return { ...asset, metadata: formattedMetadata };
                  }
                } catch {
                  // IPFS fetch failed, use fallback
                }
                return {
                  ...asset,
                  metadata: {
                    ...asset.metadata,
                    ...(asset.description && { description: asset.description }),
                    ...(asset.name && { name: asset.name }),
                  },
                };
              }

              return {
                ...asset,
                metadata: formatMetadataFromIpfs(asset.metadata ?? {}),
              };
            } catch {
              return null;
            } finally {
              pendingNftRequests.delete(assetId);
            }
          })();

          // Register this request as pending
          pendingNftRequests.set(assetId, requestPromise);

          const data = await requestPromise;
          return { assetId, data };
        };

        // Fetch uncached NFTs in parallel
        const [newResults, pendingResults] = await Promise.all([
          Promise.all(uncachedIds.map(processNft)),
          Promise.all(pendingPromises),
        ]);

        const allResults = [...newResults, ...pendingResults];
        const fetchedAssets: AssetMap = {};

        for (const { assetId, data } of allResults) {
          if (data) {
            fetchedAssets[assetId] = data;
          }
        }

        const allAssets = { ...cachedAssets, ...fetchedAssets };
        set({ mappedNfts: { ...get().mappedNfts, ...fetchedAssets } });
        return allAssets;
      },
    }),
    {
      name: localStorageKeys.FUEL_MAPPED_ASSETS,
      version: 1,
      migrate: (persistedState, version) => {
        const state = persistedState as Store;
        // Increment version number to force cache refresh
        // Version 0 -> 1: Initial migration, clear all cached data
        if (version < 1) {
          return {
            ...state,
            mappedTokens: {},
            mappedNfts: {},
          };
        }
        return state;
      },
    },
  ),
);

export const getAssetInfo = (assetId: string) => {
  const state = useMappedAssetStore.getState();
  return state.mappedTokens[assetId] || state.mappedNfts[assetId];
};

/**
 * Manual invalidation functions for asset cache
 * Use these when you need to force a refresh of cached asset data
 */
export const invalidateAssetCache = {
  /**
   * Clear all cached asset data (tokens and NFTs)
   */
  all: () => {
    useMappedAssetStore.setState({ mappedTokens: {}, mappedNfts: {} });
  },
  /**
   * Clear only token cache
   */
  tokens: () => {
    useMappedAssetStore.setState({ mappedTokens: {} });
  },
  /**
   * Clear only NFT cache
   */
  nfts: () => {
    useMappedAssetStore.setState({ mappedNfts: {} });
  },
  /**
   * Remove a specific asset from cache
   */
  asset: (assetId: string) => {
    const state = useMappedAssetStore.getState();
    const { [assetId]: _token, ...restTokens } = state.mappedTokens;
    const { [assetId]: _nft, ...restNfts } = state.mappedNfts;
    useMappedAssetStore.setState({
      mappedTokens: restTokens,
      mappedNfts: restNfts,
    });
  },
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
