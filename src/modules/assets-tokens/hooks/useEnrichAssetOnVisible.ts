import { useRef } from 'react';
import { useMappedAssetStore } from '@/modules/assets-tokens/hooks/useAssetMap';

type EnrichAssetOnVisibleProps = {
  visibleAssetIds: string[];
  chainId: number;
  type: 'token' | 'nft' | 'both';
};

export function useEnrichAssetOnVisible() {
  const assetStore = useMappedAssetStore();
  const fetchedIds = useRef<Set<string>>(new Set());

  const enrich = ({
    visibleAssetIds,
    chainId,
    type = 'both',
  }: EnrichAssetOnVisibleProps) => {
    const idsToFetch = visibleAssetIds.filter((id) => {
      const alreadyFetched = fetchedIds.current.has(id);
      const isCached =
        (type === 'token' && assetStore.mappedTokens[id]) ||
        (type === 'nft' && assetStore.mappedNfts[id]) ||
        (type === 'both' &&
          assetStore.mappedTokens[id] &&
          assetStore.mappedNfts[id]);

      return !alreadyFetched && !isCached;
    });

    if (idsToFetch.length === 0) return;

    idsToFetch.forEach((id) => fetchedIds.current.add(id));

    if (type === 'token' || type === 'both') {
      assetStore.fetchAssets(idsToFetch, chainId);
    }

    if (type === 'nft' || type === 'both') {
      assetStore.fetchNfts(idsToFetch, chainId);
    }
  };

  return enrich;
}
