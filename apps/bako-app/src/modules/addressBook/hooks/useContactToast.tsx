import {
  CheckMarkCircleIcon,
  CheckMarkCircleIconError,
  TriangleWarning,
} from '@bako-safe/ui';
import { Icon, ToastPosition } from '@chakra-ui/react';

import { useNotification } from '@/modules/notification';

interface ToastParams {
  description?: string;
  title?: string;
  position?: ToastPosition;
}

interface UseContactToastProps {
  createdAccountNotification?: boolean;
}

const useContactToast = ({
  createdAccountNotification = false,
}: UseContactToastProps = {}) => {
  const toast = useNotification(undefined, createdAccountNotification);

  const successToast = ({ description, title, position }: ToastParams) =>
    toast({
      status: 'success',
      duration: 4000,
      isClosable: false,
      position: position ?? 'top-right',
      title: title ?? 'Success!',
      description: description ?? '',
      icon: <Icon fontSize="xl" color="success.700" as={CheckMarkCircleIcon} />,
    });

  const warningToast = ({ description, title, position }: ToastParams) => {
    toast({
      status: 'warning',
      duration: 4000,
      isClosable: false,
      position: position ?? 'top-right',
      title: title ?? 'Warning!',
      description: description ?? '',
      icon: <Icon fontSize="xl" color="brand.500" as={TriangleWarning} />,
    });
  };

  const errorToast = ({ description, title, position }: ToastParams) => {
    toast({
      status: 'error',
      duration: 4000,
      isClosable: false,
      position: position ?? 'top-right',
      title: title ?? 'Error!',
      description:
        description ?? 'Check the provided data and try again, please...',
      icon: (
        <Icon fontSize="xl" color="error.500" as={CheckMarkCircleIconError} />
      ),
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