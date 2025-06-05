import { QueryState, useQuery } from '@tanstack/react-query';

import { queryClient } from '@/config/query-client';
import { useMappedAssetStore } from '@/modules/assets-tokens/hooks/useAssetMap';
import { localStorageKeys } from '@/modules/auth/services';

import { HasReservedCoins, VaultService } from '../../services';
import { vaultInfinityQueryKey } from '../list/useVaultTransactionsRequest';
import { vaultAssetsQueryKey } from './useVaultAssets';

export const useHasReservedCoins = (
  predicateId: string,
  workspaceId: string,
) => {
  const reservedQueryKey = vaultAssetsQueryKey.VAULT_ASSETS_QUERY_KEY(
    workspaceId,
    predicateId,
  );

  const vaultTxListRequestQueryKey =
    vaultInfinityQueryKey.VAULT_TRANSACTION_LIST_PAGINATION_QUERY_KEY(
      predicateId,
    );

  const cachedData: QueryState<HasReservedCoins | undefined> | undefined =
    queryClient.getQueryState(
      vaultAssetsQueryKey.VAULT_ASSETS_QUERY_KEY(workspaceId, predicateId),
    );

  const staleTime = 20 * 1000; // 20s
  const refetchInterval = 5 * 60 * 1000; // 5m

  const { refetch, ...rest } = useQuery({
    queryKey: reservedQueryKey,
    queryFn: async () => {
      // todo: return on api call the
      const response = await VaultService.hasReservedCoins(predicateId);
      const chainId =
        Number(
          window.localStorage.getItem(localStorageKeys.SELECTED_CHAIN_ID),
        ) ?? 0;
      if (response?.currentBalanceUSD !== cachedData?.data?.currentBalanceUSD) {
        queryClient.invalidateQueries({ queryKey: vaultTxListRequestQueryKey });
      }

      const assetStore = useMappedAssetStore.getState();

      await assetStore.fetchAssets(
        response.currentBalance.map((item) => item.assetId),
        chainId,
      );
      await assetStore.fetchNfts(
        response.nfts.map((item) => item.assetId),
        chainId,
      );

      const enrichedNfts = response.nfts.map((nft) => {
        const mappedNft = assetStore.mappedNfts[nft.assetId];
        return {
          ...nft,
          name: mappedNft?.name ?? null,
          collection: mappedNft?.collection ?? null,
          symbol: mappedNft?.symbol ?? null,
          image: mappedNft?.metadata?.image ?? null,
        };
      });

      return {
        ...response,
        nfts: enrichedNfts,
      };
    },
    refetchInterval,
    refetchOnWindowFocus: true,
    placeholderData: (previousData) => previousData,
    enabled: !!predicateId,
    staleTime,
  });

  const refetchAssets = () => {
    if (!predicateId) return;
    refetch();
  };

  return {
    ...rest,
    staleTime,
    refetchAssets,
    reservedQueryKey,
  };
};
