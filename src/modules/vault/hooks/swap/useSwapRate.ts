import { useMemo } from 'react';

import { SwapState } from '../../components/swap/Root';

export const useSwapRate = ({ swapState }: { swapState: SwapState }) => {
  const assetIn = swapState.from;
  const assetOut = swapState.to;

  return useMemo(() => {
    const amountIn = assetIn.amount || '0';
    const amountOut = assetOut.amount || '0';

    if (amountIn === '0' || amountOut === '0') {
      return null;
    }

    // const rate = amountOut.div(amountIn).toNumber();
    const rate = parseFloat(amountOut) / parseFloat(amountIn);
    const priceString = rate.toLocaleString('en-US', {
      minimumFractionDigits: assetIn.units || 0,
    });
    return `1 ${assetIn.slug} = ${priceString} ${assetOut.slug}`;
  }, [
    assetIn.amount,
    assetIn.units,
    assetOut.amount,
    // assetOut.units,
    assetIn.slug,
    assetOut.slug,
  ]);
};
