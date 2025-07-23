import { useQuery } from '@tanstack/react-query';
import { bn } from 'fuels';
import { PoolId } from 'mira-dex-ts';
import { useMemo } from 'react';

import { useDebounce } from '@/modules/core';

import { SwapMode, SwapState } from '../../components/swap/Root';
import { useMiraReadonly } from './useMiraReadonly';

export const useGetAmountOut = ({
  state,
  mode,
  pools,
}: {
  state: SwapState;
  mode: SwapMode;
  pools: PoolId[];
}) => {
  const amm = useMiraReadonly();
  const debouncedAmountIn = useDebounce(state.from.amount || '0', 600);
  const isSellMode = useMemo(() => mode === 'sell', [mode]);

  const coinIn = useMemo(() => state.from, [state.from]);
  const amountInWithSixDecimals = useMemo(
    () => Number(debouncedAmountIn).toFixed(6),
    [debouncedAmountIn],
  );
  const amountIn = useMemo(
    () => bn.parseUnits(amountInWithSixDecimals, coinIn.units),
    [amountInWithSixDecimals, coinIn.units],
  );
  const shouldFetch = useMemo(
    () =>
      !!amm &&
      amountIn.gt(0) &&
      !!coinIn.assetId &&
      isSellMode &&
      pools.length > 0,
    [amm, amountIn, coinIn.assetId, isSellMode, pools.length],
  );

  const { data: amountOut, ...rest } = useQuery({
    queryKey: ['amm-get-amount-out', debouncedAmountIn, pools, coinIn.assetId],
    queryFn: async () => {
      if (!amm) {
        return null;
      }
      return amm.getAmountsOut({ bits: coinIn.assetId }, amountIn, pools);
    },
    enabled: shouldFetch,
  });

  return { amountOut, ...rest };
};
