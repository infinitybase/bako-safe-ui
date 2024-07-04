import { useTokensStore } from '../store';
import { ITransferAsset } from 'bakosafe';

const useTxAmountToUSD = (assets: ITransferAsset[]) => {
  const { tokens, isLoading } = useTokensStore();

  if (!isLoading) {
    const totalAmount = assets.reduce((acc, asset) => {
      const token = tokens[asset.assetId];
      if (token && asset.amount) {
        const usdAmount = token.usdAmount;
        const assetAmount = Number(asset.amount);
        const transactionAmount = assetAmount * usdAmount;
        return acc + transactionAmount;
      } else {
        return acc;
      }
    }, 0);

    return totalAmount.toFixed(2);
  }
};

export { useTxAmountToUSD };
