import { bn, InputValue, Predicate } from 'fuels';
import { useQuery } from 'react-query';

import { assetsMap, NativeAssetId } from '@/modules/core';

const balancesToAssets = async (predicate?: Predicate<InputValue[]>) => {
  if (!predicate) return [];

  const balances = await predicate.getBalances();

  return balances.map((balance) => {
    const assetInfos = assetsMap[balance.assetId];
    return {
      amount: balance.amount.format(),
      slug: assetInfos?.slug ?? 'UKN',
      name: assetInfos?.name ?? 'Unknown',
      assetId: balance.assetId,
    };
  });
};

function useVaultAssets(predicate?: Predicate<InputValue[]>) {
  const { data: assets, ...rest } = useQuery(
    ['predicate/assets', predicate],
    () => balancesToAssets(predicate),
    {
      initialData: [],
      refetchInterval: 10000,
    },
  );

  const getCoinAmount = (assetId: string) => {
    const balance = assets?.find((asset) => asset.assetId === assetId);

    if (!balance) {
      return bn(0);
    }

    return bn(bn.parseUnits(balance.amount));
  };

  const getCoinBalance = (assetId: string) => {
    const balance = assets?.find((asset) => asset.assetId === assetId);

    if (!balance) {
      return bn(0).format();
    }

    return bn(bn.parseUnits(balance.amount)).format({ precision: 3 });
  };

  const getEthBalance = () => {
    return getCoinBalance(NativeAssetId);
  };

  const getAssetInfo = (assetId: string) => {
    return assetsMap[assetId];
  };

  const hasAssetBalance = (assetId: string, value: string) => {
    const coinBalance = getCoinBalance(assetId);
    const hasBalance = bn(bn.parseUnits(value)).lte(bn.parseUnits(coinBalance));

    if (!hasBalance) {
      return 'Not found asset balance.';
    }

    return true;
  };

  return {
    assets,
    ...rest,
    ethBalance: getEthBalance(),
    getAssetInfo,
    getEthBalance,
    getCoinAmount,
    getCoinBalance,
    hasAssetBalance,
  };
}

export { useVaultAssets };
