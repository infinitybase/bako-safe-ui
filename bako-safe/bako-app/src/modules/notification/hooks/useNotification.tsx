import { StyleProps, useToast, UseToastOptions } from '@chakra-ui/react';

import { Notification } from '@/modules/notification/components';

const useNotification = (
  options?: UseToastOptions,
  createdAccountNotification?: boolean,
) => {
  const createdAccountNotificationStyle: StyleProps | null =
    createdAccountNotification
      ? {
          position: 'absolute',
          top: -14,
          right: 5,
        }
      : null;

  return useToast({
    containerStyle: {
      display: 'flex',
      alignItems: 'flex-end',
      flexDirection: 'column',
      minW: 'min-content',
      ...createdAccountNotificationStyle,
    },
    position: 'top-right',
    render: (props) => <Notification {...props} />,
    ...options,
  });
};

export { useNotification };
