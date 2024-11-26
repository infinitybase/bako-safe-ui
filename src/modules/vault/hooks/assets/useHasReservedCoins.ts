import { QueryState, useQuery } from '@tanstack/react-query';

import { queryClient } from '@/config/query-client';

import { HasReservedCoins, VaultService } from '../../services';
import { vaultInfinityQueryKey } from '../list/useVaultTransactionsRequest';
import { vaultAssetsQueryKey } from './useVaultAssets';
import { WorkspaceService } from '@/modules/workspace/services';
import { localStorageKeys } from '@/modules/auth/services';

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

      const currentBalancePromises = response.currentBalance.map((item) => {
        return WorkspaceService.getMyMappedTokens(
          item.assetId,
          chainId,
          localStorageKeys.FUEL_MAPPED_TOKENS,
        );
      });
      const nftsPromises = response.nfts.map((item) => {
        return WorkspaceService.getMyMappedTokens(
          item.assetId,
          chainId,
          localStorageKeys.FUEL_MAPPED_NFTS,
        );
      });

      await Promise.all([
        Promise.all(currentBalancePromises),
        Promise.all(nftsPromises),
      ]);

      return response;
    },
    refetchInterval,
    refetchOnWindowFocus: false,
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
