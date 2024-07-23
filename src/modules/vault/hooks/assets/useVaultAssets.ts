import { useQuery } from '@tanstack/react-query';
import { Vault } from 'bakosafe';
import { bn } from 'fuels';
import { useCallback, useMemo, useState } from 'react';

import { useAuth } from '@/modules/auth/hooks';
import { assetsMap, ETHDefault, NativeAssetId } from '@/modules/core';

const IS_VISIBLE_KEY = '@bakosafe/balance-is-visible';

const isVisibleBalance = () => localStorage.getItem(IS_VISIBLE_KEY) === 'true';
const setIsVisibleBalance = (isVisible: 'true' | 'false') =>
  localStorage.setItem(IS_VISIBLE_KEY, isVisible);

import { VaultService } from '../../services';

const balancesToAssets = async (predicate?: Vault) => {
  if (!predicate) return {};

  const { currentBalanceUSD, currentBalance } =
    await VaultService.hasReservedCoins(predicate.BakoSafeVaultId);

  return { assets: currentBalance, balanceUSD: currentBalanceUSD };
};

function useVaultAssets(predicate?: Vault) {
  const initialVisibility = isVisibleBalance();

  const [isFirstAssetsLoading, setIsFirstAssetsLoading] = useState(true);
  const [visibleBalance, setVisibleBalance] = useState(initialVisibility);

  const auth = useAuth();

  const { data: assets, ...rest } = useQuery({
    queryKey: [
      'predicate/assets',
      auth.workspaces.current,
      predicate?.BakoSafeVaultId,
    ],
    queryFn: () =>
      balancesToAssets(setBalanceUSD, predicate).then((data) => {
        setTimeout(() => setIsFirstAssetsLoading(false), 500);
        return data;
      }),
    initialData: [],
    refetchInterval: 10000,
    placeholderData: (previousData) => previousData,
    enabled: !!predicate,
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
      const balance = data?.assets?.find((asset) => asset.assetId === assetId);

      if (!balance) {
        return bn(0);
      }

      return bn(bn.parseUnits(balance.amount!));
    },
    [data?.assets],
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
      const coinBalance = getCoinAmount(assetId).format();
      const hasBalance = bn(bn.parseUnits(value)).lte(
        bn.parseUnits(String(coinBalance)),
      );

      return hasBalance;
    },
    [getCoinAmount],
  );

  const hasBalance = useMemo(() => {
    const result = data?.assets?.some((asset) =>
      bn(bn.parseUnits(asset.amount)).gt(0),
    );

    return result;
  }, [data?.assets]);

  const ethBalance = useMemo(() => {
    return getCoinAmount(NativeAssetId).format();
  }, [getCoinAmount]);

  const handleSetVisibleBalance = (visible: any) => {
    setVisibleBalance(visible);
    setIsVisibleBalance(visible ? 'true' : 'false');
  };

  return {
    assets: data?.assets,
    ...rest,
    getAssetInfo,
    getCoinAmount,
    hasAssetBalance,
    setVisibleBalance: handleSetVisibleBalance,
    hasBalance,
    ethBalance,
    hasAssets: !!data?.assets?.length,
    isFirstAssetsLoading,
    visibleBalance,
    balanceUSD: data?.balanceUSD,
    setIsFirstAssetsLoading,
  };
}

export { useVaultAssets };
