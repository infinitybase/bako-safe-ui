import { useNotification } from '@/modules/notification';

interface ToastParams {
  description?: string;
  title?: string;
}

const useContactToast = () => {
  const toast = useNotification();

  const successToast = ({ description, title }: ToastParams) =>
    toast({
      status: 'success',
      duration: 4000,
      isClosable: false,
      title: title ?? 'Success!',
      description: description ?? '',
    });

  const warningToast = ({ description, title }: ToastParams) => {
    toast({
      status: 'warning',
      duration: 4000,
      isClosable: false,
      title: title ?? 'Warning!',
      description: description ?? '',
    });
  };

  const errorToast = ({ description, title }: ToastParams) => {
    toast({
      status: 'error',
      duration: 4000,
      isClosable: false,
      title: title ?? 'Error!',
      description:
        description ?? 'Check the provided data and try again, please...',
    });
  };

  const createAndUpdateSuccessToast = () =>
    successToast({
      title: 'Nice!',
      description:
        'Next time you can use it just by typing this name label or address...',
    });

  return {
    successToast,
    errorToast,
    createAndUpdateSuccessToast,
    warningToast,
  };
};

export { useContactToast };
