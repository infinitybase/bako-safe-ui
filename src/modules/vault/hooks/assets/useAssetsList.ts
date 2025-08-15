import { useQuery } from '@tanstack/react-query';
import { Vault } from 'bakosafe';
import { useMemo } from 'react';

import { useTokensUSDAmountRequest } from '@/modules/home';

import { useBaseAssetList } from './useBaseAssetList';

export const useAssetsList = ({ vault }: { vault?: Vault }) => {
  const { data: balances, isLoading: isLoadingBalances } = useQuery({
    queryKey: ['vaultBalances', vault],
    queryFn: async () => {
      if (!vault) {
        return null;
      }
      return (await vault.getBalances()).balances;
    },
  });
  const { assets, isLoading: isLoadingAssets } = useBaseAssetList();
  const { data, isLoading: isLoadingUSDTokens } = useTokensUSDAmountRequest();

  const assetsWithBalance = useMemo(
    () =>
      assets
        .map((asset) => ({
          ...asset,
          balance:
            balances?.find((balance) => balance.assetId === asset.assetId)
              ?.amount || null,
          rate: data?.[asset.assetId]?.usdAmount,
        }))
        .sort((a, b) => {
          if (a.balance && b.balance) {
            return a.balance.gt(b.balance) ? -1 : 1;
          }
          return 0;
        }),
    [assets, balances, data],
  );

  return {
    assets: assetsWithBalance,
    isLoading: isLoadingAssets || isLoadingBalances || isLoadingUSDTokens,
  };
};
