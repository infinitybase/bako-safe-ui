import { Assets, assets } from 'fuels';
import { useMemo } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { localStorageKeys } from '@/modules/auth/services/methods';
import { jamMonitor } from '@/modules/core/services/jamMonitor';
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
          } else {
            // Log cache hit
            jamMonitor.assetFetchCacheHit({
              assetId,
              assetName: asset.name,
              assetSymbol: asset.symbol,
            });
          }
          assets[assetId] = asset;
        }
        set({ mappedTokens: { ...get().mappedTokens, ...assets } });
        return assets;
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
                (asset?.totalSupply === null && !('rate' in asset))
              ) {
                const withNativeMetadata =
                  Object.keys(asset.metadata).filter(
                    (metadata) => !['uri', 'image'].includes(metadata),
                  ).length > 0;

                if (!withNativeMetadata && asset.metadata.uri) {
                  const metadataUrl = parseURI(asset.metadata.uri);
                  const timer = jamMonitor.startTimer();

                  // Log NFT metadata fetch start
                  jamMonitor.nftMetadataFetchStart({
                    assetId,
                    url: metadataUrl,
                  });

                  try {
                    const data = await requestWithTimeout<Record<string, string>>(
                      metadataUrl,
                      3000, // 3 seconds timeout
                    );
                    if (data) {
                      const formattedMetadata = formatMetadataFromIpfs(data);
                      assets[assetId] = { ...asset, metadata: formattedMetadata };

                      // Log NFT metadata fetch success
                      jamMonitor.nftMetadataFetchSuccess({
                        assetId,
                        url: metadataUrl,
                        duration: timer(),
                        assetName: formattedMetadata.name || asset.name,
                      });
                    } else {
                      // Log timeout/empty response
                      jamMonitor.nftMetadataFetchError({
                        assetId,
                        url: metadataUrl,
                        error: { message: 'Request timeout or empty response' },
                      });

                      assets[assetId] = {
                        ...asset,
                        metadata: {
                          ...asset.metadata,
                          ...(asset.description && {
                            description: asset.description,
                          }),
                          ...(asset.name && { name: asset.name }),
                        },
                      };
                    }
                  } catch (error) {
                    // Log NFT metadata fetch error
                    jamMonitor.nftMetadataFetchError({
                      assetId,
                      url: metadataUrl,
                      error: {
                        message: error instanceof Error ? error.message : String(error),
                      },
                    });

                    assets[assetId] = {
                      ...asset,
                      metadata: {
                        ...asset.metadata,
                        ...(asset.description && {
                          description: asset.description,
                        }),
                        ...(asset.name && { name: asset.name }),
                      },
                    };
                  }
                } else {
                  assets[assetId] = {
                    ...asset,
                    metadata: formatMetadataFromIpfs(asset.metadata ?? {}),
                  };
                }
              }
            }
          } else {
            // Log cache hit for NFT
            jamMonitor.assetFetchCacheHit({
              assetId,
              assetName: asset.name,
              isNFT: true,
            });
          }
        }
        const storeAssets = { ...assets, ...get().mappedNfts };
        set({ mappedNfts: storeAssets });
        return storeAssets;
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
