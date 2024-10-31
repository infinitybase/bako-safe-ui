import { HasReservedCoins } from '@bako-safe/services/modules/vault';
import { QueryState, useQuery } from '@tanstack/react-query';

import { queryClient } from '@/config/query-client';
import { vaultService } from '@/modules/services/services-initializer';

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
      const response = await vaultService.hasReservedCoins(predicateId);
      if (response?.currentBalanceUSD !== cachedData?.data?.currentBalanceUSD) {
        queryClient.invalidateQueries({ queryKey: vaultTxListRequestQueryKey });
      }
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
