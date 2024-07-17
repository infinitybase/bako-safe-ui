import { Vault } from 'bakosafe';
import { BN, bn } from 'fuels';
import { useCallback, useMemo } from 'react';
import { useQuery } from 'react-query';

import { useAuth } from '@/modules/auth/hooks';
import { assetsMap, ETHDefault, NativeAssetId } from '@/modules/core';

import { VaultService } from '../../services';
import { useVaultState } from '../../states';

const balancesToAssets = async (
  setBalanceUSD: (string: string) => void,
  predicate?: Vault,
) => {
  if (!predicate) return [];

  const { balanceUSD, assets } = await VaultService.hasReservedCoins(
    predicate.BakoSafeVaultId,
  );

  setBalanceUSD(balanceUSD);

  return assets;
};

function useVaultAssets(predicate?: Vault) {
  const { setVisibleBalance, setBalanceUSD, setIsFirstAssetsLoading } =
    useVaultState();

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

  const getCoinAmount = useCallback(
    (assetId: string, needsFormat?: boolean) => {
      const balance = assets?.find((asset) => asset.assetId === assetId);

      if (!balance) {
        const result = bn(0);
        return needsFormat ? result.format() : result;
      }

      const result = bn(bn.parseUnits(balance.amount!));
      return needsFormat ? result.format() : result;
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
      const coinBalance = getCoinAmount(assetId, true);
      const hasBalance = bn(bn.parseUnits(value)).lte(
        bn.parseUnits(String(coinBalance)),
      );

      return hasBalance;
    },
    [getCoinAmount],
  );

  const hasBalance = useMemo(() => {
    return assets?.some((asset) => bn(bn.parseUnits(asset.amount)).gt(0));
  }, [assets]);

  const ethBalance = useMemo(() => {
    return getCoinAmount(NativeAssetId, true);
  }, [getCoinAmount]) as string;

  return {
    assets,
    ...rest,
    getAssetInfo,
    getCoinAmount,
    hasAssetBalance,
    setVisibleBalance,
    hasBalance,
    ethBalance,
    hasAssets: !!assets?.length,
  };
}

export { useVaultAssets };
