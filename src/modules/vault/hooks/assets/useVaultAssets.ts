import { bn } from 'fuels';
import { useCallback, useMemo, useState } from 'react';

import { AssetMap, NativeAssetId } from '@/modules/core';

const IS_VISIBLE_KEY = '@bakosafe/balance-is-visible';

const isVisibleBalance = () => localStorage.getItem(IS_VISIBLE_KEY) === 'true';
const setIsVisibleBalance = (isVisible: 'true' | 'false') =>
  localStorage.setItem(IS_VISIBLE_KEY, isVisible);

import { queryClient } from '@/config';
import { gasConfig } from '@/modules/core/hooks/bakosafe/utils/gas-config';

import { useVaultTransactionsList } from '../list/useVaultTransactionsList';
import { useHasReservedCoins } from './useHasReservedCoins';

export const vaultAssetsQueryKey = {
  VAULT_ASSETS_QUERY_KEY: (workspaceId: string, predicateId: string) => [
    'predicateId/assets',
    workspaceId,
    predicateId,
  ],
};

const useVaultAssets = (
  workspaceId: string,
  predicateId: string,
  assetsMap: AssetMap,
) => {
  const initialVisibility = isVisibleBalance();
  const [visibleBalance, setVisibleBalance] = useState(initialVisibility);
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    request: { refetch: refetchTransactions },
  } = useVaultTransactionsList();

  const { data, refetchAssets, staleTime, reservedQueryKey, ...rest } =
    useHasReservedCoins(predicateId, workspaceId);

  const getCoinAmount = useCallback(
    (assetId: string) => {
      const balance = data?.currentBalance.find(
        (asset) => asset.assetId === assetId,
      );

      if (!balance) {
        return bn(0);
      }

      return bn(balance.amount);
    },
    [data?.currentBalance],
  );

  const getAssetInfo = (assetId: string) =>
    assetsMap[assetId] ?? assetsMap['UNKNOWN'];

  const hasAssetBalance = useCallback(
    (assetId: string, value: string) => {
      const units = getAssetInfo(assetId)?.units;
      const coinBalance = getCoinAmount(assetId)?.format({ units });
      const hasBalance = bn(bn.parseUnits(value)).lte(
        bn.parseUnits(coinBalance),
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

  const isEthBalanceLowerThanReservedAmount = useMemo(() => {
    // Needs to be fixed using the correct baseFee format or method
    return (
      Number(ethBalance) <= Number(bn.parseUnits(gasConfig.toString()).format())
    );
  }, [ethBalance]);

  const handleSetVisibleBalance = (visible: any) => {
    setVisibleBalance(visible);
    setIsVisibleBalance(visible ? 'true' : 'false');
  };

  const handleManualRefetch = async () => {
    const queryState = queryClient.getQueryState(reservedQueryKey);
    const freshData =
      queryState?.dataUpdatedAt &&
      Date.now() - queryState?.dataUpdatedAt < staleTime;

    if (freshData || isUpdating) return;

    setIsUpdating(true);

    await Promise.all([refetchAssets(), refetchTransactions()]).finally(() => {
      setIsUpdating(false);
    });
  };

  const isNFTAsset = useCallback(
    (assetId: string): boolean =>
      !!data?.nfts?.some((nft) => nft.assetId === assetId),
    [data?.nfts],
  );

  return {
    assets: data?.currentBalance,
    nfts: data?.nfts,
    ...rest,
    getAssetInfo,
    getCoinAmount,
    hasAssetBalance,
    setVisibleBalance: handleSetVisibleBalance,
    isUpdating,
    handleManualRefetch,
    hasBalance,
    ethBalance,
    isEthBalanceLowerThanReservedAmount,
    hasAssets: !!data?.currentBalance?.length,
    visibleBalance,
    balanceUSD: data?.currentBalanceUSD,
    refetchAssets,
    isNFTAsset,
  };
};

export { useVaultAssets };
