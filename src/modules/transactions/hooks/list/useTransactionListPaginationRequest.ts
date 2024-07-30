import { useInfiniteQuery } from '@tanstack/react-query';
import { SortOptionTx } from 'bakosafe';

import { invalidateQueries, WorkspacesQueryKey } from '@/modules/core';

import {
  GetTransactionParams,
  TransactionOrderBy,
  TransactionService,
} from '../../services';
import { PENDING_TRANSACTIONS_QUERY_KEY } from './useTotalSignaturesPendingRequest';
import { StatusFilter } from './useTransactionList';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

type UseTransactionListPaginationParams = Omit<
  GetTransactionParams,
  'perPage' | 'page'
> & {};

const useTransactionListPaginationRequest = (
  params: UseTransactionListPaginationParams,
) => {
  const {
    workspaces: { current },
  } = useWorkspaceContext();

  const { data, ...query } = useInfiniteQuery({
    queryKey: WorkspacesQueryKey.TRANSACTION_LIST_PAGINATION_QUERY_KEY(
      current,
      params.status as StatusFilter,
      params.predicateId?.[0],
      params.id,
      params.type,
    ),
    queryFn: ({ pageParam }) =>
      TransactionService.getTransactionsPagination({
        ...params,
        perPage: 5,
        page: pageParam || 0,
        orderBy: TransactionOrderBy.CREATED_AT,
        sort: SortOptionTx.DESC,
        id: params.id,
      }).then((data) => {
        invalidateQueries([PENDING_TRANSACTIONS_QUERY_KEY]);
        return data;
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.currentPage !== lastPage.totalPages
        ? lastPage.nextPage
        : undefined,
  });

  return {
    ...query,
    transactionsPages: data,
    transactions: data?.pages.map((page) => page.data).flat() ?? [],
  };
};

export { useTransactionListPaginationRequest };
