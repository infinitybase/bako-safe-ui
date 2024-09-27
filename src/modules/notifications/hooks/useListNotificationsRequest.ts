import { useInfiniteQuery } from '@tanstack/react-query';

import { NotificationsQueryKey } from '@/modules/core';
import { SortOptionTx } from '@/modules/core/hooks/bakosafe/utils/types';
import {
  SortOption,
  TransactionOrderBy,
} from '@/modules/transactions/services';

import { NotificationService } from '../services';

const useListNotificationsRequest = (account: string) => {
  const { data, ...query } = useInfiniteQuery({
    queryKey: [NotificationsQueryKey.PAGINATED_LIST, account],
    queryFn: ({ pageParam }) =>
      NotificationService.getAllWithPagination({
        perPage: 5,
        page: pageParam || 0,
        orderBy: TransactionOrderBy.CREATED_AT,
        sort: SortOption.DESC,
      }),
    initialPageParam: 0,
    getNextPageParam: ({ totalPages, currentPage, nextPage }) =>
      currentPage !== totalPages ? nextPage : undefined,
    refetchOnMount: false,
    staleTime: 100, // 500ms second to prevent request spam
    refetchOnWindowFocus: false,
  });

  return {
    notifications: data?.pages.map((page) => page.data).flat() ?? [],
    ...query,
  };
};

export { useListNotificationsRequest };
