import { useInfiniteQuery } from '@tanstack/react-query';
import { SortOptionTx, TransactionType } from 'bakosafe';

import {
  GetTransactionsWithIncomingsParams,
  TransactionOrderBy,
  TransactionService,
} from '@/modules/transactions/services';

type UseTransactionListPaginationParams = Omit<
  GetTransactionsWithIncomingsParams,
  'perPage' | 'offsetDb' | 'offsetFuel'
>;

export const VAULT_TRANSACTIONS_LIST_PAGINATION =
  'vault-transaction-list-pagination';

export const vaultInfinityQueryKey = {
  VAULT_TRANSACTION_LIST_PAGINATION_QUERY_KEY: (
    vaultId?: string,
    status?: string,
    type?: TransactionType,
    id?: string,
  ) => [VAULT_TRANSACTIONS_LIST_PAGINATION, vaultId, status, type, id],
};

const useVaultTransactionsRequest = (
  params: UseTransactionListPaginationParams,
) => {
  const status = Array.isArray(params.status)
    ? params.status.join('-')
    : params.status;

  const queryKey =
    vaultInfinityQueryKey.VAULT_TRANSACTION_LIST_PAGINATION_QUERY_KEY(
      params.predicateId?.[0],
      status,
      params.type,
      params.id,
    );

  const { data, ...query } = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam: { offsetDb, offsetFuel } }) =>
      TransactionService.getTransactionsWithIncomingsPagination({
        ...params,
        perPage: 5,
        offsetDb: offsetDb || 0,
        offsetFuel: offsetFuel || 0,
        orderBy: TransactionOrderBy.CREATED_AT,
        sort: SortOptionTx.DESC,
      }).then((data) => {
        return data;
      }),
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!params.predicateId && !!params.predicateId[0],
    initialPageParam: { offsetDb: 0, offsetFuel: 0 },
    getNextPageParam: (lastPage) => {
      if (lastPage.data.length === 0) {
        return undefined;
      }

      return { offsetDb: lastPage.offsetDb, offsetFuel: lastPage.offsetFuel };
    },
  });

  return {
    ...query,
    transactionsPages: data,
  };
};

export { useVaultTransactionsRequest };
