import type { AssetModel } from '@bako-safe/services';

import type { ITokens } from '@/modules/home/hooks/useTokensUSDAmountRequest';

export type IAssetsInfoToUSD = Pick<AssetModel, 'assetId' | 'amount'>;

const useTxAmountToUSD = (
  assets: IAssetsInfoToUSD[],
  isLoading: boolean,
  tokens: ITokens,
  isUnknownToken: (assetId: string) => boolean,
) => {
  if (!isLoading && tokens && isUnknownToken) {
    const hasUnknownToken =
      assets.filter((asset) => isUnknownToken(asset.assetId)).length === 0;

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

    return hasUnknownToken
      ? '--'
      : totalAmount.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
  }

  return '0.00';
};

export { useTxAmountToUSD };
