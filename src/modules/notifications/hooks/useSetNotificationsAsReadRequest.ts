import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { NotificationsQueryKey } from '@/modules/core';

import { NotificationService, SetAllAsReadResponse } from '../services';

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
