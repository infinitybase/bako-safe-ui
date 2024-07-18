import { ITransferAsset } from 'bakosafe';

import { useTokensStore } from '../store';

const useTxAmountToUSD = (assets: ITransferAsset[]) => {
  const { tokens, isLoading } = useTokensStore();

  if (!isLoading) {
    const totalAmount = assets
      .filter((asset) => !!asset)
      .reduce((acc, asset) => {
        const token = tokens[asset.assetId];
        if (token && asset.amount) {
          const usdAmount = token.usdAmount;
          const assetAmount = Number(asset.amount);
          const transactionAmount = assetAmount * usdAmount;
          return acc + transactionAmount;
        }

        return acc;
      }, 0);

    return totalAmount.toFixed(2);
  }

  return '0.00';
};

export { useTxAmountToUSD };
