import { BN, bn } from 'fuels';
import { useMemo } from 'react';

import { MinEthValueBN } from '@/config/swap';
import { Asset, NativeAssetId } from '@/modules/core';

export const useAvailableEthBalance = (
  assetIn: Asset,
  assets: (Asset & { balance: BN | null })[],
) => {
  const ethBalance =
    useMemo(
      () => assets.find((a) => a.assetId === NativeAssetId)?.balance,
      [assets],
    ) || bn(0);
  return useMemo(() => {
    if (assetIn.assetId === NativeAssetId && assetIn.amount) {
      const amountParsed = bn.parseUnits(assetIn.amount, assetIn.units);
      const amountWithMinEthValue = amountParsed.add(MinEthValueBN);
      return ethBalance.gte(amountWithMinEthValue);
    }
    return true;
  }, [assetIn, ethBalance]);
};
