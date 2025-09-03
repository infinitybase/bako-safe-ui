import { useQuery } from '@tanstack/react-query';
import { Vault } from 'bakosafe';
import { bn } from 'fuels';
import { useMemo } from 'react';

import { useTokensUSDAmountRequest } from '@/modules/home';

import { useBaseAssetList } from './useBaseAssetList';

export const useAssetsList = ({ vault }: { vault?: Vault }) => {
  const { data: balances, isLoading: isLoadingBalances } = useQuery({
    queryKey: ['vaultAssetsBalances', vault?.address],
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
          if (a.balance && a.rate && b.balance && b.rate) {
            const aUsd = bn(a.balance)
              .mul(bn(Math.floor(a.rate * 10)))
              .div(bn(10).pow(a.units));
            const bUsd = bn(b.balance)
              .mul(bn(Math.floor(b.rate * 10)))
              .div(bn(10).pow(b.units));

            return aUsd.gt(bUsd) ? -1 : 1;
          }

          if (a.balance && a.rate) return -1;
          if (b.balance && b.rate) return 1;

          if (a.balance && b.balance) {
            return bn(a.balance).gt(bn(b.balance)) ? -1 : 1;
          }

          if (a.balance) return -1;
          if (b.balance) return 1;

          return 0;
        }),
    [assets, balances, data],
  );

  return {
    assets: assetsWithBalance,
    isLoading: isLoadingAssets || isLoadingBalances || isLoadingUSDTokens,
  };
};
