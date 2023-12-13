import { Vault } from 'bsafe';
import { bn } from 'fuels';
import { useCallback, useEffect, useMemo } from 'react';
import { useQuery } from 'react-query';

import { assetsMap, NativeAssetId } from '@/modules/core';

import { VaultService } from '../../services';
import { useVaultState } from '../../states';

const balancesToAssets = async (predicate?: Vault) => {
  if (!predicate) return [];

  const balances = await predicate.getBalances();
  const currentETH = await VaultService.hasReservedCoins(
    predicate.BSAFEVaultId,
  );

  const result = balances.map((balance) => {
    const assetInfos = assetsMap[balance.assetId];
    const hasETH = balance.assetId === NativeAssetId && currentETH;
    return {
      amount: hasETH
        ? balance.amount.sub(currentETH).format()
        : balance.amount.format(),
      slug: assetInfos?.slug ?? 'UKN',
      name: assetInfos?.name ?? 'Unknown',
      assetId: balance.assetId,
      icon: assetInfos?.icon,
    };
  });

  return result || [];
};

function useVaultAssets(predicate?: Vault) {
  const { setVisibleBalance, setBiggerAsset } = useVaultState();

  const { data: assets, ...rest } = useQuery(
    ['predicate/assets', predicate],
    () => balancesToAssets(predicate),
    {
      initialData: [],
      refetchInterval: 10000,
      keepPreviousData: true,
      enabled: !!predicate,
    },
  );
  const findBiggerAsset = () => {
    let bigger = 0;
    const isValid = assets && assets.length > 0;

    if (isValid) {
      setBiggerAsset(assets[0]);
      assets.map((item, index) => {
        const _isValid =
          index > 0 &&
          item?.amount &&
          bn(assets[bigger].amount) < bn(item.amount);
        if (_isValid) {
          bigger = index;
        }
      });
      setBiggerAsset(assets[bigger]);
    }
  };

  useEffect(() => {
    findBiggerAsset();

    return () => {
      setBiggerAsset(null);
    };
  }, [assets]);

  const getCoinAmount = useCallback(
    (assetId: string) => {
      const balance = assets?.find((asset) => asset.assetId === assetId);

      if (!balance) {
        return bn(0);
      }

      return bn(bn.parseUnits(balance.amount!));
    },
    [assets],
  );

  const getCoinBalance = useCallback(
    (assetId: string) => {
      const balance = assets?.find((asset) => asset.assetId === assetId);

      if (!balance) {
        return bn(0).format();
      }

      return bn(bn.parseUnits(balance.amount!)).format({ precision: 3 });
    },
    [assets],
  );

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

  const ethBalance = useMemo(() => {
    return getCoinBalance(NativeAssetId);
  }, [getCoinBalance]);

  return {
    assets,
    ...rest,
    ethBalance,
    getAssetInfo,
    getCoinAmount,
    getCoinBalance,
    hasAssetBalance,
    setVisibleBalance,
    hasBalance,
    hasAssets: !!assets?.length,
  };
}

export { useVaultAssets };
