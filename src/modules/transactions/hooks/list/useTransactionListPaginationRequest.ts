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
  const { mutate: sendTransaction } = useBakoSafeTransactionSend({
    onError: (e) => {
      console.log('ERROR WHILE SEND TO CHAIN', e);
    },
    onSuccess: () => {
      console.log('sucesso');
    },
  });

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
        data.data
          .flatMap((item) =>
            item.transactions.filter(
              (tx) => tx.status === TransactionStatus.PROCESS_ON_CHAIN,
            ),
          )
          .forEach((transaction) => {
            console.log('transaction:', transaction);
            sendTransaction({ transaction: transaction! });
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
