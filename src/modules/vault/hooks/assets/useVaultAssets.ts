import { useQuery } from '@tanstack/react-query';
import { bn } from 'fuels';
import { useCallback, useMemo, useState } from 'react';

import { assetsMap, ETHDefault, NativeAssetId } from '@/modules/core';

const IS_VISIBLE_KEY = '@bakosafe/balance-is-visible';

const isVisibleBalance = () => localStorage.getItem(IS_VISIBLE_KEY) === 'true';
const setIsVisibleBalance = (isVisible: 'true' | 'false') =>
  localStorage.setItem(IS_VISIBLE_KEY, isVisible);

import { VaultService } from '../../services';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

function useVaultAssets(predicateId: string) {
  const initialVisibility = isVisibleBalance();
  const [visibleBalance, setVisibleBalance] = useState(initialVisibility);

  const { authDetails } = useWorkspaceContext();

  const { data, ...rest } = useQuery({
    queryKey: [
      'predicateId/assets',
      authDetails.userInfos.workspace?.id,
      predicateId,
    ],
    queryFn: () => VaultService.hasReservedCoins(predicateId),
    refetchInterval: 10000,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
    enabled: !!predicateId,
  });

  const getCoinAmount = useCallback(
    (assetId: string) => {
      const balance = data?.currentBalance.find(
        (asset) => asset.assetId === assetId,
      );

      if (!balance) {
        return bn(0);
      }

      return bn(bn.parseUnits(balance.amount!));
    },
    [data?.currentBalance],
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
    const result = data?.currentBalance.some((asset) =>
      bn(bn.parseUnits(asset.amount)).gt(0),
    );

    return result;
  }, [data?.currentBalance]);

  const ethBalance = useMemo(() => {
    return getCoinAmount(NativeAssetId).format();
  }, [getCoinAmount]);

  const handleSetVisibleBalance = (visible: any) => {
    setVisibleBalance(visible);
    setIsVisibleBalance(visible ? 'true' : 'false');
  };

  return {
    assets: data?.currentBalance,
    ...rest,
    getAssetInfo,
    getCoinAmount,
    hasAssetBalance,
    setVisibleBalance: handleSetVisibleBalance,
    hasBalance,
    ethBalance,
    hasAssets: !!data?.currentBalance?.length,
    visibleBalance,
    balanceUSD: data?.currentBalanceUSD,
  };
}

export { useVaultAssets };
