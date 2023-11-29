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
      }),
    {
      getNextPageParam: (lastPage) =>
        lastPage.currentPage !== lastPage.totalPages
          ? lastPage.nextPage
          : undefined,
    },
  );

  return {
    notifications: data?.pages.map((page) => page.data).flat() ?? [],
    ...query,
  };
};

export { useListNotificationsRequest };
