import { useInfiniteQuery } from '@tanstack/react-query';

import { WorkspacesQueryKey } from '@/modules/core';
import { SortOptionTx } from '@/modules/core/hooks/bakosafe/utils/types';
import { useGroupTransactionsByDay } from '@/modules/core/hooks/useGroupTransactionsByDay';
import { DEFAULT_INITIAL_PAGE_PARAM } from '@/utils/constants';

import {
  GetTransactionParams,
  TransactionOrderBy,
  TransactionService,
} from '../../services';
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
      TransactionService.getTransactionsPagination({
        ...params,
        perPage: 5,
        page: pageParam || DEFAULT_INITIAL_PAGE_PARAM,
        orderBy: TransactionOrderBy.CREATED_AT,
        sort: SortOptionTx.DESC,
      }),
    enabled: window.location.pathname != '/',
    initialPageParam: DEFAULT_INITIAL_PAGE_PARAM,
    refetchOnWindowFocus: false,
    // Socket events handle real-time updates
    staleTime: 1000 * 60 * 2, // 2 minutes
    getNextPageParam: (lastPage) =>
      lastPage.currentPage !== lastPage.totalPages
        ? lastPage.nextPage
        : undefined,
  });

  const transactionsList = data?.pages.map((page) => page.data).flat() ?? [];

  return {
    ...query,
    transactions: useGroupTransactionsByDay(transactionsList),
  };
};

export { useTransactionListPaginationRequest };
