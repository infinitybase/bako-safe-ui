import { useRef } from 'react';

import { toaster } from '@/components/ui/toaster';

interface ToastOptions {
  title: string;
  description?: string;
  type?: 'info' | 'success' | 'error' | 'warning';
  duration?: number;
}

const useToast = () => {
  const toastRef = useRef<string | number | null>(null);

  const update = (params: ToastOptions) => {
    if (toastRef.current) {
      toaster.update(toastRef.current, {
        title: params.title,
        description: params.description,
        type: params.type || 'info',
      });
    }
  };

  const show = (params: ToastOptions) => {
    toastRef.current = toaster.create({
      title: params.title,
      description: params.description,
      type: params.type || 'info',
      duration: params.duration || 5000,
    });
  };

  const success = (title: string) => {
    toaster.create({
      title,
      type: 'success',
      duration: 5000,
    });
  };

  const error = (title: string) => {
    toaster.create({
      id: 'error',
      title,
      type: 'error',
      duration: 5000,
    });
  };

  return {
    show,
    error,
    update,
    success,
  };
};

export { useToast };
