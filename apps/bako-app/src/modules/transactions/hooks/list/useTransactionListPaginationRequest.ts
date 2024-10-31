import {
  GetTransactionParams,
  TransactionOrderBy,
} from '@bako-safe/services/modules/transaction';
import { SortOption } from '@bako-safe/services/types';
import { useInfiniteQuery } from '@tanstack/react-query';

import { invalidateQueries } from '@/modules/core';
import { useGroupTransactionsByMonth } from '@/modules/core/hooks/useGroupTransactionsByMonth';
import { transactionService } from '@/modules/services/services-initializer';
import { WorkspacesQueryKey } from '@/modules/workspace';

import { PENDING_TRANSACTIONS_QUERY_KEY } from './useTotalSignaturesPendingRequest';
import { StatusFilter } from './useTransactionList';

type UseTransactionListPaginationParams = Omit<
  GetTransactionParams,
  'perPage' | 'page'
> & {
  workspaceId: string;
};

const useTransactionListPaginationRequest = (
  params: UseTransactionListPaginationParams,
) => {
  const { data, ...query } = useInfiniteQuery({
    queryKey: WorkspacesQueryKey.TRANSACTION_LIST_PAGINATION_QUERY_KEY(
      params.workspaceId,
      params.status as StatusFilter,
      params.predicateId?.[0],
      params.id,
      params.type,
    ),
    queryFn: ({ pageParam }) =>
      transactionService
        .getTransactionsPagination({
          ...params,
          perPage: 5,
          page: pageParam || 0,
          orderBy: TransactionOrderBy.CREATED_AT,
          sort: SortOption.DESC,
        })
        .then((data) => {
          invalidateQueries([PENDING_TRANSACTIONS_QUERY_KEY]);
          return data;
        }),
    enabled: window.location.pathname != '/',
    initialPageParam: 0,
    refetchOnWindowFocus: true,
    getNextPageParam: (lastPage) =>
      lastPage.currentPage !== lastPage.totalPages
        ? lastPage.nextPage
        : undefined,
  });

  const transactionsList = data?.pages.map((page) => page.data).flat() ?? [];

  return {
    ...query,
    transactions: useGroupTransactionsByMonth(transactionsList),
  };
};

export { useTransactionListPaginationRequest };
