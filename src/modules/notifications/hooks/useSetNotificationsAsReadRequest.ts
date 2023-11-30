import { useMutation, UseMutationOptions } from 'react-query';

import { NotificationService, SetAllAsReadResponse } from '../services';

const useSetNotificationsAsReadRequest = (
  options?: UseMutationOptions<SetAllAsReadResponse, unknown, unknown>,
) => {
  return useMutation(
    'notification/set-all-as-read',
    NotificationService.setAllAsRead,
    options,
  );
};

export { useSetNotificationsAsReadRequest };
