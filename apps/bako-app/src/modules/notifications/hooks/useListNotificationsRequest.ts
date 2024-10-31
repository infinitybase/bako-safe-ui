import { TransactionOrderBy } from '@bako-safe/services/modules/transaction';
import { SortOption } from '@bako-safe/services/types';
import { useInfiniteQuery } from '@tanstack/react-query';

import { notificationService } from '@/config/services-initializer';

import { NotificationsQueryKey } from '../utils';

const useListNotificationsRequest = (account: string) => {
  const { data, ...query } = useInfiniteQuery({
    queryKey: [NotificationsQueryKey.PAGINATED_LIST, account],
    queryFn: ({ pageParam }) =>
      notificationService.getAllWithPagination({
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
