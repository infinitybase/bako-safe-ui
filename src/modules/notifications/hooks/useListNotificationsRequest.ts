import { useInfiniteQuery } from '@tanstack/react-query';
import { SortOption } from 'bakosafe';

import { NotificationsQueryKey } from '@/modules/core';

import { NotificationService } from '../services';

const useListNotificationsRequest = (account: string, enabled?: boolean) => {
  const { data, ...query } = useInfiniteQuery({
    queryKey: [NotificationsQueryKey.PAGINATED_LIST, account],
    queryFn: ({ pageParam }) =>
      NotificationService.getAllWithPagination({
        perPage: 5,
        page: pageParam || 0,
        orderBy: 'createdAt',
        sort: SortOption.desc,
      }),
    initialPageParam: 0,
    getNextPageParam: ({ totalPages, currentPage, nextPage }) =>
      currentPage !== totalPages ? nextPage : undefined,
    enabled,
    refetchOnWindowFocus: false,
  });

  return {
    notifications: data?.pages.map((page) => page.data).flat() ?? [],
    ...query,
  };
};

export { useListNotificationsRequest };
