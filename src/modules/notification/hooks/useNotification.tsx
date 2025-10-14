import React from 'react';

import { toaster } from '@/components/ui/toaster';

interface UseToastOptions {
  status?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  isClosable?: boolean;
  position?:
    | 'top'
    | 'top-right'
    | 'top-left'
    | 'bottom'
    | 'bottom-right'
    | 'bottom-left';
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

const useNotification = (options?: UseToastOptions) => {
  return (toastOptions: UseToastOptions) => {
    toaster.create({
      title: toastOptions.title || options?.title,
      description: toastOptions.description || options?.description,
      type: toastOptions.status || options?.status || 'info',
      duration: toastOptions.duration || options?.duration || 5000,
      ...options,
      ...toastOptions,
    });
  };
};

export { useNotification };
