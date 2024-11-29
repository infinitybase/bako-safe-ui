import { useQuery } from '@tanstack/react-query';

import { NotificationsQueryKey } from '@/modules/core';

import { NotificationService } from '../services';

const useUnreadNotificationsCounterRequest = () => {
  return useQuery({
    queryKey: [NotificationsQueryKey.UNREAD_COUNTER],
    queryFn: async () =>
      NotificationService.getAllWithPagination({
        unread: true,
        perPage: 5,
        page: 0,
      }),
    refetchInterval: false,
    refetchOnWindowFocus: true,
  });
};

export { useUnreadNotificationsCounterRequest };
