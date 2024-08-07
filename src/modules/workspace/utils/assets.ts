import { bn, CoinQuantity } from 'fuels';

import { assetsMap } from '@/modules/core/utils/assets';

export const handleAssetsBalance = (balances: CoinQuantity[] = []) => {
  const result = balances.map((balance) => {
    const assetInfos = assetsMap[balance.assetId];

    return {
      amount: bn(balance.amount).format(),
      slug: assetInfos?.slug ?? 'UKN',
      name: assetInfos?.name ?? 'Unknown',
      assetId: balance.assetId,
      icon: assetInfos?.icon,
    };
  });

  return result;
};
