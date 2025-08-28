import { useMemo } from 'react';

import { Asset } from '@/modules/core';

import { computeAllRoutes, getPoolIdCombinations } from '../../utils';
import { useAllAssetsCombination } from './useAllAssetsCombination';
import { usePoolsWithReserve } from './usePoolsWithReserve';

export const useRoutablePools = (
  assetIn: Asset,
  assetOut: Asset,
  shouldFetch = false,
) => {
  const pairs = useAllAssetsCombination(assetIn, assetOut);

  const poolKeys = useMemo(() => getPoolIdCombinations(pairs), [pairs]);

  const { pools, ...rest } = usePoolsWithReserve(poolKeys, shouldFetch);

  const routes = useMemo(() => {
    if (!pools) {
      return [];
    }
    return computeAllRoutes(assetIn, assetOut, pools, 2);
  }, [assetIn, assetOut, pools]);

  return { routes, ...rest };
};
