import React from 'react';

import { toaster } from '@/components/ui/toaster';

interface UseToastOptions {
  id?: string;
  status?: 'success' | 'error' | 'warning' | 'info' | 'loading';
  duration?: number;
  isClosable?: boolean;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

const useNotification = (options?: UseToastOptions) => {
  return (toastOptions: UseToastOptions) => {
    const status = toastOptions.status || options?.status || 'info';
    const method = status === 'loading' ? toaster.loading : toaster.create;
    method({
      status,
      id: toastOptions.id || options?.id,
      title: toastOptions.title || options?.title,
      description: toastOptions.description || options?.description,
      type: toastOptions.status || options?.status || 'info',
      duration: toastOptions.duration || options?.duration || 5000,
      closable: toastOptions.isClosable || options?.isClosable || false,
      ...options,
      ...toastOptions,
    });
  };
};

export { useNotification };
