import { useToast, UseToastOptions } from '@chakra-ui/react';
import React from 'react';

import { Notification } from '@/modules/notification/components';

const useNotification = (options?: UseToastOptions) => {
  return useToast({
    containerStyle: {
      display: 'flex',
      alignItems: 'flex-end',
      flexDirection: 'column',
    },
    position: 'top-right',
    render: (props) => <Notification {...props} />,
    ...options,
  });
};

export { useNotification };
