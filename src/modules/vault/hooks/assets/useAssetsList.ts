import { useQuery } from '@tanstack/react-query';
import { Vault } from 'bakosafe';
import { useMemo } from 'react';

import { useWorkspaceContext } from '@/modules/workspace/hooks';

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
  const { tokensUSD } = useWorkspaceContext();

  const assetsWithBalance = useMemo(
    () =>
      assets
        .map((asset) => {
          const currentBalance = balances?.find(
            (balance) => balance.assetId === asset.assetId,
          )?.amount;

          const usdData = tokensUSD.data[asset.assetId.toLowerCase()];
          return {
            ...asset,
            balance:
              currentBalance && !currentBalance.isZero()
                ? currentBalance
                : null,
            rate: usdData?.usdAmount ?? null,
          };
        })
        .sort((a, b) => {
          const aAmount =
            a.balance
              ?.format({
                units: a.units,
              })
              .replace(/,/g, '') ?? 0;

          const bAmount =
            b.balance
              ?.format({
                units: b.units,
              })
              .replace(/,/g, '') ?? 0;

          const aUsd = Number(aAmount) * (a.rate ?? 0);
          const bUsd = Number(bAmount) * (b.rate ?? 0);

          if (aUsd !== bUsd) {
            return bUsd - aUsd;
          }

          const aNum = Number(aAmount);
          const bNum = Number(bAmount);

          if (aNum !== bNum) {
            return bNum - aNum;
          }

          return 0;
        }),
    [assets, balances, tokensUSD.data],
  );

  return {
    assets: assetsWithBalance,
    isLoading: isLoadingAssets || isLoadingBalances,
  };
};
