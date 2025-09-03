import { useQuery } from '@tanstack/react-query';
import { Vault } from 'bakosafe';
import { useMemo } from 'react';

import { useMappedAssetStore } from '@/modules/assets-tokens/hooks/useAssetMap';
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
  const { getAssetByAssetId } = useMappedAssetStore();
  const { assets, isLoading: isLoadingAssets } = useBaseAssetList();
  const { data, isLoading: isLoadingUSDTokens } = useTokensUSDAmountRequest();

  const noVerifiedAssets = useMemo(
    () =>
      balances
        ?.filter(
          (balance) =>
            !assets.find((asset) => asset.assetId === balance.assetId),
        )
        .map((asset) => {
          const assetInfo = getAssetByAssetId(asset.assetId);
          return {
            ...assetInfo,
            assetId: asset.assetId,
            balance: asset.amount.isZero() ? null : asset.amount,
            rate: data?.[asset.assetId]?.usdAmount,
            name: assetInfo?.name || 'Unknown',
            slug: assetInfo?.slug || assetInfo?.symbol || 'unknown',
            symbol: assetInfo?.symbol || 'UNK',
            units: assetInfo?.units || 9,
            icon: assetInfo?.icon || '/tokens/unknown.svg',
          };
        })
        .filter((a) => !a.isNFT) || [],
    [assets, balances, getAssetByAssetId, data],
  );
  console.log(noVerifiedAssets);

  const assetsWithBalance = useMemo(
    () =>
      assets
        .map((asset) => {
          const currentBalance = balances?.find(
            (balance) => balance.assetId === asset.assetId,
          )?.amount;
          return {
            ...asset,
            balance: currentBalance?.isZero() ? null : currentBalance,
            rate: data?.[asset.assetId]?.usdAmount,
          };
        })
        .concat(...noVerifiedAssets)
        .sort((a, b) => {
          if (a.balance && a?.rate && b.balance && b?.rate) {
            const aUsd = a.balance.mul(Math.floor(a.rate * 1e9)).div(1e9);
            const bUsd = b.balance.mul(Math.floor(b.rate * 1e9)).div(1e9);
            return aUsd.gt(bUsd) ? -1 : 1;
          }

          if (a.balance && a?.rate) return -1;
          if (b.balance && b.rate) return 1;

          if (a.balance && b.balance) {
            return a.balance.gt(b.balance) ? -1 : 1;
          }

          if (a.balance) return -1;
          if (b.balance) return 1;

          return 0;
        }),
    [assets, balances, data, noVerifiedAssets],
  );

  return {
    assets: assetsWithBalance,
    isLoading: isLoadingAssets || isLoadingBalances || isLoadingUSDTokens,
  };
};
