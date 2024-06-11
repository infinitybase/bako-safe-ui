import { Vault } from 'bakosafe';
import { bn } from 'fuels';
import { useCallback, useEffect, useMemo } from 'react';
import { useQuery } from 'react-query';

import { useAuth } from '@/modules/auth/hooks';
import { assetsMap, NativeAssetId } from '@/modules/core';

import { VaultService } from '../../services';
import { useVaultState } from '../../states';

const balancesToAssets = async (
  setBalanceUSD: (string: string) => void,
  predicate?: Vault,
) => {
  if (!predicate) return [];

  const balances = await predicate.getBalances();
  const { reservedCoins, balanceUSD } = await VaultService.hasReservedCoins(
    predicate.BakoSafeVaultId,
  );
  setBalanceUSD(balanceUSD);
  const result = balances.map((balance) => {
    const assetInfos = assetsMap[balance.assetId];
    const reservedCoinAmount = reservedCoins?.find(
      (item) => item.assetId === balance.assetId,
    )?.amount;

    return {
      amount: reservedCoinAmount
        ? balance.amount.sub(reservedCoinAmount).format()
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
  const {
    setVisibleBalance,
    setBiggerAsset,
    setBalanceUSD,
    setIsFirstAssetsLoading,
  } = useVaultState();

  const auth = useAuth();

  const { data: assets, ...rest } = useQuery(
    ['predicate/assets', auth.workspaces.current, predicate],
    () => balancesToAssets(setBalanceUSD, predicate),
    {
      initialData: [],
      refetchInterval: 10000,
      keepPreviousData: true,
      enabled: !!predicate,
      onSuccess: () => {
        setIsFirstAssetsLoading(false);
      },
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
          bn(bn.parseUnits(assets[bigger].amount)) <
            bn(bn.parseUnits(item.amount));
        if (_isValid) {
          bigger = index;
        }
      });
      setBiggerAsset(assets[bigger]);
    }
  };

  useEffect(() => {
    findBiggerAsset();
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

      /**
       * TODO: calculate exact gas fee, get resource to spend in provider
       * https://github.com/FuelLabs/fuels-wallet/blob/15358f509596d823f201a2bfd3721d4e26fc52cc/packages/app/src/systems/Transaction/services/transaction.tsx#L270-L289C15
       * **/
      //const gasConfig = provider?.getGasConfig();

      return (
        bn(bn.parseUnits(balance.amount!))
          //.sub(bn.parseUnits('0.001'))
          //defaultConfigurable['gasPrice'].mul(defaultConfigurable['gasLimit']),
          .format({ precision: 5 })
      );
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
