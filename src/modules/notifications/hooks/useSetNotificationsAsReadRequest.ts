import { useMutation, UseMutationOptions } from 'react-query';

import { NotificationService, SetAllAsReadResponse } from '../services';

const useSetNotificationsAsReadRequest = (
  options?: UseMutationOptions<SetAllAsReadResponse, unknown, unknown>,
) => {
  console.log(
    '🚀 ~ file: useSetNotificationsAsReadRequest.ts:14 ~ useSetNotificationsAsReadRequest:',
    useSetNotificationsAsReadRequest,
  );
  return useMutation(
    'notification/set-all-as-read',
    NotificationService.setAllAsRead,
    options,
  );
};

export { useSetNotificationsAsReadRequest };
