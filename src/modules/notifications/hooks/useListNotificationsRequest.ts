import { SortOption } from 'bsafe';
import { useInfiniteQuery } from 'react-query';

import { GetAllNotificationsPayload, NotificationService } from '../services';

const useListNotificationsRequest = (filter?: GetAllNotificationsPayload) => {
  const { data, ...query } = useInfiniteQuery(
    'notifications/pagination',
    ({ pageParam }) =>
      NotificationService.getAllWithPagination({
        ...filter,
        perPage: 5,
        page: pageParam || 0,
        orderBy: 'createdAt',
        sort: SortOption.DESC,
      }),
    {
      getNextPageParam: ({ totalPages, currentPage, nextPage }) =>
        currentPage !== totalPages ? nextPage : undefined,
    },
  );

  return {
    notifications: data?.pages.map((page) => page.data).flat() ?? [],
    ...query,
  };
};

export { useListNotificationsRequest };
