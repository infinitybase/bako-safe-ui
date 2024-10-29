import {
  NotificationService,
  SetAllAsReadResponse,
} from '@bako-safe/services/modules/notifications';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { NotificationsQueryKey } from '../utils';

const useSetNotificationsAsReadRequest = (
  options?: UseMutationOptions<SetAllAsReadResponse, unknown, unknown>,
) => {
  return useMutation({
    mutationKey: [NotificationsQueryKey.READ_ALL],
    mutationFn: NotificationService.setAllAsRead,
    ...options,
  });
};

export { useSetNotificationsAsReadRequest };
