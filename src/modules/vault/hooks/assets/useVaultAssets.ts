import { useQuery } from '@tanstack/react-query';
import { Vault } from 'bakosafe';
import { bn } from 'fuels';
import { useCallback, useEffect, useMemo } from 'react';

import BakoIcon from '@/assets/tokens/bako.svg';
import { useAuth } from '@/modules/auth/hooks';
import { Asset, assetsMap, ETHDefault, NativeAssetId } from '@/modules/core';

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
  const result = balances.reduce((acc, balance) => {
    const assetInfos = assetsMap[balance.assetId];
    const reservedCoinAmount = reservedCoins?.find(
      (item) => item.assetId === balance.assetId,
    )?.amount;
    const adjustedAmount = reservedCoinAmount
      ? balance.amount.sub(reservedCoinAmount)
      : balance.amount;

    if (adjustedAmount.gt(0)) {
      acc.push({
        amount: adjustedAmount.format(),
        slug: assetInfos?.slug ?? 'UKN',
        name: assetInfos?.name ?? 'Unknown',
        assetId: balance.assetId,
        icon: assetInfos?.icon ?? BakoIcon,
      });
    }

    return acc;
  }, [] as Required<Asset>[]);

  return result;
};

function useVaultAssets(predicate?: Vault) {
  const {
    setVisibleBalance,
    setBiggerAsset,
    setBalanceUSD,
    setIsFirstAssetsLoading,
  } = useVaultState();

  const auth = useAuth();

  const { data: assets, ...rest } = useQuery({
    queryKey: ['predicate/assets', auth.workspaces.current, predicate],
    queryFn: () => balancesToAssets(setBalanceUSD, predicate),
    initialData: [],
    refetchInterval: 10000,
    placeholderData: (previousData) => previousData,
    enabled: !!predicate,
    onSuccess: () => {
      setIsFirstAssetsLoading(false);
    },
  });
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
    } else {
      setBiggerAsset({
        assetId: NativeAssetId,
        name: '',
        icon: '',
        slug: '',
        amount: '0',
      });
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
          .format()
      );
    },
    [assets],
  );

  const getAssetInfo = (assetId: string) => {
    return (
      assetsMap[assetId] ?? {
        name: 'Unknown',
        slug: 'UKN',
        icon: ETHDefault,
      }
    );
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
    getAssetInfo,
    getCoinAmount,
    getCoinBalance,
    hasAssetBalance,
    setVisibleBalance,
    hasBalance,
    ethBalance,
    hasAssets: !!assets?.length,
  };
}

export { useVaultAssets };
