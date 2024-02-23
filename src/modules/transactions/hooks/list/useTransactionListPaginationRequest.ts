import { useInfiniteQuery } from 'react-query';

import { useAuth } from '@/modules/auth';
import { invalidateQueries, WorkspacesQueryKey } from '@/modules/core';

import {
  GetTransactionParams,
  SortOption,
  TransactionService,
} from '../../services';
import { PENDING_TRANSACTIONS_QUERY_KEY } from './useTotalSignaturesPendingRequest';
import { StatusFilter } from './useTransactionList';

type UseTransactionListPaginationParams = Omit<
  GetTransactionParams,
  'perPage' | 'page'
>;

const useTransactionListPaginationRequest = (
  params: UseTransactionListPaginationParams,
) => {
  const {
    workspaces: { current },
  } = useAuth();

  const { data, ...query } = useInfiniteQuery(
    WorkspacesQueryKey.TRANSACTION_LIST_PAGINATION_QUERY_KEY(
      current,
      params.status as StatusFilter,
    ),
    ({ pageParam }) =>
      TransactionService.getTransactionsPagination({
        ...params,
        perPage: 5,
        page: pageParam || 0,
        orderBy: 'createdAt',
        sort: SortOption.DESC,
      }),
    {
      onSuccess: () => invalidateQueries([PENDING_TRANSACTIONS_QUERY_KEY]),
      getNextPageParam: (lastPage) =>
        lastPage.currentPage !== lastPage.totalPages
          ? lastPage.nextPage
          : undefined,
    },
  );

  return {
    ...query,
    transactions: data?.pages.map((page) => page.data).flat() ?? [],
  };
};

export { useTransactionListPaginationRequest };
