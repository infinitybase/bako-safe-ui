import { useMutation, UseMutationOptions } from 'react-query';

import { NotificationsQueryKey } from '@/modules/core';

import { NotificationService, SetAllAsReadResponse } from '../services';

const useSetNotificationsAsReadRequest = (
  options?: UseMutationOptions<SetAllAsReadResponse, unknown, unknown>,
) => {
  return useMutation(
    NotificationsQueryKey.READ_ALL,
    NotificationService.setAllAsRead,
    options,
  );
};

export { useSetNotificationsAsReadRequest };
