import { ITokens } from '@/modules/home/hooks/useTokensUSDAmountRequest';
import { ITransferAsset } from 'bakosafe';

const useTxAmountToUSD = (
  assets: ITransferAsset[],
  isLoading: boolean,
  tokens: ITokens,
) => {
  if (!isLoading && tokens) {
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
