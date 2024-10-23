import { useQuery } from '@tanstack/react-query';

import { NotificationsQueryKey } from '@/modules/core';

import { NotificationService } from '../services';

const { VITE_NOTIFICATIONS_REFRESH } = import.meta.env;

const useUnreadNotificationsCounterRequest = () => {
  return useQuery({
    queryKey: [NotificationsQueryKey.UNREAD_COUNTER],
    queryFn: async () =>
      NotificationService.getAllWithPagination({
        unread: true,
        perPage: 5,
        page: 0,
      }),
    refetchInterval: Number(VITE_NOTIFICATIONS_REFRESH),
    refetchOnWindowFocus: true,
  });
};

export { useUnreadNotificationsCounterRequest };
