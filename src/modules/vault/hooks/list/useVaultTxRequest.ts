import { useInfiniteQuery } from '@tanstack/react-query';
import { SortOptionTx, TransactionType } from 'bakosafe';
import { StatusFilter } from '@/modules/transactions';
import {
  GetTransactionParams,
  TransactionOrderBy,
  TransactionService,
} from '@/modules/transactions/services';

type UseTransactionListPaginationParams = Omit<
  GetTransactionParams,
  'perPage' | 'page' | 'status'
> & {
  status?: StatusFilter[];
};

export const VAULT_TRANSACTIONS_LIST_PAGINATION =
  'vault-transaction-list-pagination';

export const vaultInfinityQueryKey = {
  VAULT_TRANSACTION_LIST_PAGINATION_QUERY_KEY: (
    vaultId?: string,
    status?: string[],
    id?: string,
    type?: TransactionType,
  ) => [VAULT_TRANSACTIONS_LIST_PAGINATION, vaultId, status, id, type],
};

const useVaultTxRequest = (params: UseTransactionListPaginationParams) => {
  const queryKey =
    vaultInfinityQueryKey.VAULT_TRANSACTION_LIST_PAGINATION_QUERY_KEY(
      params.predicateId?.[0],
      params.status,
      params.id,
      params.type,
    );

  const { data, ...query } = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) =>
      TransactionService.getTransactionsPagination({
        ...params,
        perPage: 5,
        page: pageParam || 0,
        orderBy: TransactionOrderBy.CREATED_AT,
        sort: SortOptionTx.DESC,
        id: params.id,
      }).then((data) => {
        return data;
      }),
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!params.predicateId && !!params.predicateId[0],
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.currentPage !== lastPage.totalPages
        ? lastPage.nextPage
        : undefined,
    maxPages: 2,
  });

  return {
    ...query,
    transactionsPages: data,
  };
};

export { useVaultTxRequest };
