import { useInfiniteQuery } from '@tanstack/react-query';
import { SortOptionTx } from 'bakosafe';

import { useAuth } from '@/modules/auth';
import { invalidateQueries, WorkspacesQueryKey } from '@/modules/core';

import {
  GetTransactionsWithIncomingsParams,
  TransactionOrderBy,
  TransactionService,
} from '../../services';
import { PENDING_TRANSACTIONS_QUERY_KEY } from './useTotalSignaturesPendingRequest';
import { StatusFilter } from './useTransactionList';

type UseTransactionListPaginationParams = Omit<
  GetTransactionsWithIncomingsParams,
  'perPage' | 'offsetDb' | 'offsetFuel'
>;

const useTransactionListPaginationRequest = (
  params: UseTransactionListPaginationParams,
) => {
  const {
    workspaces: { current },
  } = useAuth();

  const { data, ...query } = useInfiniteQuery({
    queryKey: WorkspacesQueryKey.TRANSACTION_LIST_PAGINATION_QUERY_KEY(
      current,
      params.status as StatusFilter,
      params.predicateId?.[0],
      params.type,
    ),
    queryFn: ({ pageParam: { offsetDb, offsetFuel } }) =>
      TransactionService.getTransactionsWithIncomingsPagination({
        ...params,
        perPage: 5,
        offsetDb: offsetDb || 0,
        offsetFuel: offsetFuel || 0,
        orderBy: TransactionOrderBy.CREATED_AT,
        sort: SortOptionTx.DESC,
      }).then((data) => {
        invalidateQueries([PENDING_TRANSACTIONS_QUERY_KEY]);
        return data;
      }),
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
    transactions: data?.pages.map((page) => page.data).flat() ?? [],
  };
};

export { useTransactionListPaginationRequest };
