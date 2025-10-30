import { useInfiniteQuery } from '@tanstack/react-query';
import { TransactionType } from 'bakosafe';

import { SortOptionTx } from '@/modules/core/hooks/bakosafe/utils/types';
import { useGroupTransactionsByDay } from '@/modules/core/hooks/useGroupTransactionsByDay';
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
  ) => {
    const key = [VAULT_TRANSACTIONS_LIST_PAGINATION];

    if (vaultId) key.push(vaultId);
    if (status) key.push(status);
    if (type) key.push(type);
    if (id) key.push(id);

    return key;
  },
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
    refetchOnWindowFocus: true,
    enabled: !!params.predicateId && !!params.predicateId[0],
    initialPageParam: { offsetDb: 0, offsetFuel: 0 },
    getNextPageParam: (lastPage) => {
      if (lastPage?.data?.length === 0) {
        return undefined;
      }

      return { offsetDb: lastPage.offsetDb, offsetFuel: lastPage.offsetFuel };
    },
  });

  const transactionsList =
    data?.pages.map((page) => page.data ?? page).flat() ?? [];

  return {
    ...query,
    queryKey,
    transactions: useGroupTransactionsByDay(transactionsList),
  };
};

export { useVaultTransactionsRequest };
