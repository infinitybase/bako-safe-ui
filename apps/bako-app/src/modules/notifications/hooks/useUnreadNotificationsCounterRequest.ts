import { useQuery } from '@tanstack/react-query';

import { notificationService } from '@/config/services-initializer';

import { NotificationsQueryKey } from '../utils';

const { VITE_NOTIFICATIONS_REFRESH } = import.meta.env;

const useUnreadNotificationsCounterRequest = () => {
  return useQuery({
    queryKey: [NotificationsQueryKey.UNREAD_COUNTER],
    queryFn: async () =>
      notificationService.getAllWithPagination({
        unread: true,
        perPage: 5,
        page: 0,
      }),
    refetchInterval: Number(VITE_NOTIFICATIONS_REFRESH),
    refetchOnWindowFocus: true,
  });
};

export { useUnreadNotificationsCounterRequest };
