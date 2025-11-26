import { useInfiniteQuery } from '@tanstack/react-query';

import { NotificationsQueryKey } from '@/modules/core';
import {
  SortOption,
  TransactionOrderBy,
} from '@/modules/transactions/services';
import { DEFAULT_INITIAL_PAGE_PARAM } from '@/utils/constants';

import { NotificationService } from '../services';

const useListNotificationsRequest = (account: string) => {
  const { data, ...query } = useInfiniteQuery({
    queryKey: [NotificationsQueryKey.PAGINATED_LIST, account],
    queryFn: ({ pageParam }) =>
      NotificationService.getAllWithPagination({
        perPage: 5,
        page: pageParam || DEFAULT_INITIAL_PAGE_PARAM,
        orderBy: TransactionOrderBy.CREATED_AT,
        sort: SortOption.DESC,
      }),
    initialPageParam: DEFAULT_INITIAL_PAGE_PARAM,
    getNextPageParam: ({ totalPages, currentPage, nextPage }) =>
      currentPage !== totalPages ? nextPage : undefined,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: false,
  });

  return {
    notifications: data?.pages.map((page) => page.data).flat() ?? [],
    ...query,
  };
};

export { useListNotificationsRequest };
