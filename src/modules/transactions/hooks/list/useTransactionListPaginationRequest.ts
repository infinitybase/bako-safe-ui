import { useInfiniteQuery } from 'react-query';

import {
  GetTransactionParams,
  SortOption,
  TransactionService,
} from '../../services';

type UseTransactionListPaginationParams = Omit<
  GetTransactionParams,
  'perPage' | 'page'
>;

const TRANSACTION_LIST_PAGINATION_QUERY_KEY = 'transactions/pagination';

const useTransactionListPaginationRequest = (
  params: UseTransactionListPaginationParams,
) => {
  const { data, ...query } = useInfiniteQuery(
    [TRANSACTION_LIST_PAGINATION_QUERY_KEY, params],
    ({ pageParam }) =>
      TransactionService.getTransactionsPagination({
        ...params,
        perPage: 5,
        page: pageParam || 0,
        orderBy: 'createdAt',
        sort: SortOption.DESC,
      }),
    {
      enabled: !!params.predicateId || !!params.allOfUser,
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

export {
  TRANSACTION_LIST_PAGINATION_QUERY_KEY,
  useTransactionListPaginationRequest,
};
