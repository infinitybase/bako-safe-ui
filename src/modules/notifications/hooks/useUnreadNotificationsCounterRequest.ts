import { useQuery } from 'react-query';

import { NotificationService } from '../services';

const useUnreadNotificationsCounterRequest = () => {
  return useQuery(['notifications/counter'], async () =>
    NotificationService.getAllWithPagination({
      unread: true,
      perPage: 5,
      page: 0,
    }),
  );
};

export { useUnreadNotificationsCounterRequest };
