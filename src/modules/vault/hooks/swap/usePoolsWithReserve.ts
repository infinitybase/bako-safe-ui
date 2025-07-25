import { useQuery } from '@tanstack/react-query';

import { PoolIdCombination, PoolsWithReserve } from '../../utils';
import { useMiraReadonly } from './useMiraReadonly';

export const usePoolsWithReserve = (
  poolsCombination: PoolIdCombination[],
  shouldFetch = false,
) => {
  const amm = useMiraReadonly();

  const poolsKeys = poolsCombination.map((pool) => pool.join('-'));

  const { data: pools, ...rest } = useQuery({
    queryKey: ['amm-pools-reserve', poolsKeys],
    queryFn: async () => {
      if (!amm) {
        throw new Error('Mira AMM is not initialized');
      }
      const response = await Promise.all(
        poolsCombination.map(async (pool) => {
          const [a, b, poolId] = pool;
          const metadata = await amm.poolMetadata(poolId);

          if (!metadata) {
            return null;
          }

          return {
            assetA: a,
            assetB: b,
            poolId,
            reserve0: metadata?.reserve0,
            reserve1: metadata?.reserve1,
          };
        }),
      );
      return response.filter((pool) => pool !== null) as PoolsWithReserve[];
    },
    enabled: shouldFetch && !!amm,
  });

  return { pools, ...rest };
};
