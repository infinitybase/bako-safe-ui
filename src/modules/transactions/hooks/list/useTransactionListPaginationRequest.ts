import { useInfiniteQuery } from 'react-query';

import { GetTransactionParams, TransactionService } from '../../services';

type UseTransactionListPaginationParams = Omit<
  GetTransactionParams,
  'perPage' | 'page'
>;

const useTransactionListPaginationRequest = (
  params: UseTransactionListPaginationParams,
) => {
  const { data, ...query } = useInfiniteQuery(
    ['predicate/transactions', params],
    ({ pageParam }) =>
      TransactionService.getTransactionsPagination({
        ...params,
        perPage: 7,
        page: pageParam || 0,
      }),
    {
      enabled: !!params.predicateId,
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
