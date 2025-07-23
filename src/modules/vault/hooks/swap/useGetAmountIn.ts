import { useQuery } from '@tanstack/react-query';
import { bn } from 'fuels';
import { PoolId } from 'mira-dex-ts';
import { useMemo } from 'react';

import { useDebounce } from '@/modules/core';

import { SwapMode, SwapState } from '../../components/swap/Root';
import { useMiraReadonly } from './useMiraReadonly';

export const useGetAmountIn = ({
  state,
  mode,
  pools,
}: {
  state: SwapState;
  mode: SwapMode;
  pools: PoolId[];
}) => {
  const amm = useMiraReadonly();
  const debouncedAmountOut = useDebounce(state.to.amount || '0', 600);
  const isBuyMode = useMemo(() => mode === 'buy', [mode]);

  const coinOut = useMemo(() => state.to, [state.to]);

  const amountOut = useMemo(
    () => bn.parseUnits(debouncedAmountOut, coinOut.units),
    [debouncedAmountOut, coinOut.units],
  );
  const shouldFetch = useMemo(
    () =>
      !!amm &&
      amountOut.gt(0) &&
      !!coinOut.assetId &&
      isBuyMode &&
      pools.length > 0,
    [amm, amountOut, coinOut.assetId, isBuyMode, pools.length],
  );

  const { data: amountIn, ...rest } = useQuery({
    queryKey: ['amm-get-amount-in', debouncedAmountOut, pools, coinOut.assetId],
    queryFn: async () => {
      if (!amm) {
        return null;
      }
      return amm.getAmountsIn({ bits: coinOut.assetId }, amountOut, pools);
    },
    enabled: shouldFetch,
  });

  return { amountIn, ...rest };
};
