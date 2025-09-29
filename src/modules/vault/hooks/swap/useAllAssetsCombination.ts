import { useMemo } from 'react';

import { Asset } from '@/modules/core';

import { BASE_ASSETS } from '../../utils';

export type Combination = [Asset, Asset];

const BASE_PAIRS: Combination[] = BASE_ASSETS.flatMap((asset) =>
  BASE_ASSETS.map((otherAsset) => [asset, otherAsset] as Combination).filter(
    ([a, b]) => a.assetId !== b.assetId,
  ),
);

export const useAllAssetsCombination = (assetA: Asset, assetB: Asset) => {
  return useMemo(() => {
    const seen = new Set<string>();
    const pairs: Combination[] = [];

    const addPair = (a: Asset, b: Asset) => {
      if (a.assetId === b.assetId) return;
      const key = [a.assetId, b.assetId].sort().join('-');
      if (!seen.has(key)) {
        seen.add(key);
        pairs.push([a, b]);
      }
    };

    addPair(assetA, assetB);

    // combinations with base assets
    BASE_ASSETS.forEach((base) => {
      addPair(assetA, base);
      addPair(assetB, base);
    });

    // Predefined pairs
    BASE_PAIRS.forEach(([a, b]) => addPair(a, b));

    return pairs;
  }, [assetA, assetB]);
};
