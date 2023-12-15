import { SortOption } from 'bsafe';
import { useInfiniteQuery } from 'react-query';

import { NotificationsQueryKey } from '@/modules/core';

import { NotificationService } from '../services';

const useListNotificationsRequest = (enabled?: boolean) => {
  const { data, ...query } = useInfiniteQuery(
    NotificationsQueryKey.PAGINATED_LIST,
    ({ pageParam }) =>
      NotificationService.getAllWithPagination({
        perPage: 5,
        page: pageParam || 0,
        orderBy: 'createdAt',
        sort: SortOption.DESC,
      }),
    {
      getNextPageParam: ({ totalPages, currentPage, nextPage }) =>
        currentPage !== totalPages ? nextPage : undefined,
      enabled: enabled || false,
      refetchOnWindowFocus: false,
    },
  );

  return {
    notifications: data?.pages.map((page) => page.data).flat() ?? [],
    ...query,
  };
};

export { useListNotificationsRequest };
