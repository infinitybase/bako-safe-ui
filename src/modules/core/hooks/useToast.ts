import {
  ToastId,
  useToast as useToastChakra,
  UseToastOptions,
} from '@chakra-ui/react';
import { useRef } from 'react';

const useToast = () => {
  const toast = useToastChakra();
  const toastRef = useRef<ToastId | null>(null);

  const update = (params: UseToastOptions) => {
    if (toastRef.current) {
      toast.update(toastRef.current, params);
    }
  };

  const show = (params: UseToastOptions) => {
    toastRef.current = toast(params);
  };

  const success = (title: string) => {
    toast({
      title,
      status: 'success',
      position: 'bottom',
      isClosable: true,
      duration: 5000,
    });
  };

  const error = (title: string) => {
    toast({
      title,
      status: 'error',
      position: 'bottom',
      isClosable: true,
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
