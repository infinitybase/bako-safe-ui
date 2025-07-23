import { bn } from 'fuels';
import { useMemo } from 'react';

import { useDebounce } from '@/modules/core';

import { SwapMode, SwapState } from '../../components/swap/Root';
import { useSwapRouter } from './useSwapRouter';

export const useSwapPreview = (swapState: SwapState, mode: SwapMode) => {
  const sellAsset = swapState.from;
  const buyAsset = swapState.to;

  const isBuy = mode === 'buy';

  const rawUserInputAmount = useMemo(() => {
    const amountString = isBuy ? swapState.to.amount : swapState.from.amount;
    const amount = parseFloat(amountString || '0');
    const amountValid = !isNaN(amount);
    if (!sellAsset || !buyAsset) return bn(0);
    const decimals = isBuy ? buyAsset.units : sellAsset.units;

    try {
      return amountValid ? bn.parseUnits(amountString || '0', decimals) : bn(0);
    } catch (error) {
      console.error('Error parsing units:', error);
      return bn(0);
    }
  }, [sellAsset, buyAsset, swapState.to.amount, swapState.from.amount, isBuy]);

  // passing as bn causes infinite render
  const debouncedValue = useDebounce(rawUserInputAmount.toString(), 500);

  return useSwapRouter(mode, bn(debouncedValue), sellAsset, buyAsset);
};
