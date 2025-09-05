import { useQuery } from '@tanstack/react-query';
import { Vault } from 'bakosafe';
import { useMemo } from 'react';

import { useMappedAssetStore } from '@/modules/assets-tokens/hooks/useAssetMap';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

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
  const {
    vaultDetails: {
      assets: { nfts },
    },
    tokensUSD,
  } = useWorkspaceContext();

  const noVerifiedAssets = useMemo(
    () =>
      balances
        ?.filter(
          (balance) =>
            !assets.find((asset) => asset.assetId === balance.assetId),
        )
        .map((asset) => {
          const assetInfo = getAssetByAssetId(asset.assetId);
          const usdData = tokensUSD.data[asset.assetId.toLowerCase()];

          return {
            ...assetInfo,
            assetId: asset.assetId,
            balance: asset.amount.isZero() ? null : asset.amount,
            rate: usdData?.usdAmount ?? null,
            name: assetInfo?.name || 'Unknown',
            slug: assetInfo?.slug || assetInfo?.symbol || 'unknown',
            symbol: assetInfo?.symbol || 'UNK',
            units: assetInfo?.units || 9,
            icon:
              assetInfo?.icon ||
              assetInfo?.metadata?.URI ||
              '/tokens/unknown.svg',
          };
        })
        .filter((a) => !nfts?.some((nft) => nft.assetId === a.assetId)) || [],
    [assets, balances, getAssetByAssetId, nfts, tokensUSD.data],
  );

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
            balance: currentBalance?.isZero() ? null : currentBalance,
            rate: usdData?.usdAmount ?? null,
          };
        })
        .concat(...noVerifiedAssets)
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
    [assets, balances, tokensUSD.data, noVerifiedAssets],
  );

  return {
    assets: assetsWithBalance,
    isLoading: isLoadingAssets || isLoadingBalances,
  };
};
