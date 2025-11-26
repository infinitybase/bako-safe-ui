import { useQuery } from '@tanstack/react-query';

import { NotificationsQueryKey } from '@/modules/core';
import { DEFAULT_INITIAL_PAGE_PARAM } from '@/utils/constants';

import { NotificationService } from '../services';

const useUnreadNotificationsCounterRequest = () => {
  return useQuery({
    queryKey: [NotificationsQueryKey.UNREAD_COUNTER],
    queryFn: async () =>
      NotificationService.getAllWithPagination({
        unread: true,
        perPage: 5,
        page: DEFAULT_INITIAL_PAGE_PARAM,
      }),
    refetchInterval: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export { useUnreadNotificationsCounterRequest };
