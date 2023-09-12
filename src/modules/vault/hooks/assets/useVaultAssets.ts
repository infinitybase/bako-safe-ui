import { bn, InputValue, Predicate } from 'fuels';
import { useCallback, useMemo } from 'react';
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

  const getCoinAmount = useCallback(
    (assetId: string) => {
      const balance = assets?.find((asset) => asset.assetId === assetId);

      if (!balance) {
        return bn(0);
      }

      return bn(bn.parseUnits(balance.amount));
    },
    [assets],
  );

  const getCoinBalance = useCallback(
    (assetId: string) => {
      const balance = assets?.find((asset) => asset.assetId === assetId);

      if (!balance) {
        return bn(0).format();
      }

      return bn(bn.parseUnits(balance.amount)).format({ precision: 3 });
    },
    [assets],
  );

  const getEthBalance = () => {
    return getCoinBalance(NativeAssetId);
  };

  const getAssetInfo = (assetId: string) => {
    return assetsMap[assetId];
  };

  const hasAssetBalance = useCallback(
    (assetId: string, value: string) => {
      const coinBalance = getCoinBalance(assetId);
      const hasBalance = bn(bn.parseUnits(value)).lte(
        bn.parseUnits(coinBalance),
      );

      return hasBalance;
    },
    [getCoinBalance],
  );

  const hasBalance = useMemo(() => {
    return assets?.some((asset) => bn(bn.parseUnits(asset.amount)).gt(0));
  }, [assets]);

  return {
    assets,
    ...rest,
    ethBalance: getEthBalance(),
    getAssetInfo,
    getEthBalance,
    getCoinAmount,
    getCoinBalance,
    hasAssetBalance,
    hasBalance,
    hasAssets: !!assets?.length,
  };
}

export { useVaultAssets };
