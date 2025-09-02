import { bn } from 'fuels';
import { useMemo } from 'react';

import { useDebounce } from '@/modules/core';
import { formatMaxDecimals } from '@/utils';

import { SwapMode, SwapState } from '../../components/swap/Root';
import { useSwapRouter } from './useSwapRouter';

export const useSwapPreview = (
  swapState: SwapState,
  mode: SwapMode,
  networkUrl: string,
) => {
  const sellAsset = swapState.from;
  const buyAsset = swapState.to;

  const isBuy = mode === 'buy';

  const rawUserInputAmount = useMemo(() => {
    const amountString = isBuy ? buyAsset.amount : sellAsset.amount;
    if (!sellAsset || !buyAsset) return bn(0);
    const decimals = isBuy ? buyAsset.units : sellAsset.units;

    try {
      const coinAmount = formatMaxDecimals(amountString || '0', decimals);
      return bn.parseUnits(coinAmount || '0', decimals);
    } catch {
      return bn(0);
    }
  }, [sellAsset, buyAsset, isBuy]);

  const debouncedValue = useDebounce(rawUserInputAmount.toString(), 600);

  return useSwapRouter(
    mode,
    bn(debouncedValue),
    sellAsset,
    buyAsset,
    networkUrl,
  );
};
