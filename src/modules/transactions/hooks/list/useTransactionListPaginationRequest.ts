import { useInfiniteQuery } from '@tanstack/react-query';
import { SortOptionTx, TransactionStatus } from 'bakosafe';

import {
  invalidateQueries,
  useBakoSafeTransactionSend,
  WorkspacesQueryKey,
} from '@/modules/core';

import {
  GetTransactionParams,
  TransactionOrderBy,
  TransactionService,
} from '../../services';
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
      TransactionService.getTransactionsPagination({
        ...params,
        perPage: 5,
        page: pageParam || 0,
        orderBy: TransactionOrderBy.CREATED_AT,
        sort: SortOptionTx.DESC,
        id: params.id,
      }).then((data) => {
        invalidateQueries([PENDING_TRANSACTIONS_QUERY_KEY]);
        const pending = data.data
          .map((item) =>
            item.transactions.filter(
              (tx) => tx.status === TransactionStatus.SUCCESS,
            ),
          )
          .map((filteredTx) => {
            return filteredTx;
            // useBakoSafeTransactionSend({
            //   onSuccess: () => {
            //     query.refetch();
            //   },
            //   onError: () => {},
            //   transactionId: filteredTx.id,
            //   predicateId: params.predicateId?[0]
            // });
          });

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
