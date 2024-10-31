import { SetAllAsReadResponse } from '@bako-safe/services/modules/notifications';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { notificationService } from '@/config/services-initializer';

import { NotificationsQueryKey } from '../utils';

const useSetNotificationsAsReadRequest = (
  options?: UseMutationOptions<SetAllAsReadResponse, unknown, unknown>,
) => {
  return useMutation({
    mutationKey: [NotificationsQueryKey.READ_ALL],
    mutationFn: notificationService.setAllAsRead,
    ...options,
  });
};

export { useSetNotificationsAsReadRequest };
