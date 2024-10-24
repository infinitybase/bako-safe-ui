import { bn, CoinQuantity } from 'fuels';

import { AssetMap } from '@/modules/core';

export const handleAssetsBalance = (
  balances: CoinQuantity[] = [],
  assetsMap: false | AssetMap | undefined,
) => {
  const result = balances.map((balance) => {
    const assetInfos = assetsMap?.[balance.assetId];

    return {
      amount: bn(balance.amount).format(),
      slug: assetInfos?.slug ?? 'UKN',
      name: assetInfos?.name ?? 'Unknown',
      assetId: balance.assetId,
      icon: assetInfos?.icon,
      units: assetInfos?.units ?? 0,
    };
  });

  return result;
};
