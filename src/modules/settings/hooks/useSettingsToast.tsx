import { Icon } from 'bako-ui';
import { IoIosCheckmarkCircle } from 'react-icons/io';

import { useNotification } from '@/modules/notification';

interface ToastParams {
  description?: string;
  title?: string;
}

const useSettingsToast = () => {
  const toast = useNotification();

  const successToast = ({ description, title }: ToastParams) =>
    toast({
      status: 'success',
      duration: 4000,
      isClosable: false,
      title: title ?? 'Success!',
      description: description ?? 'Your settings was updated!',
      icon: (
        <Icon fontSize="xl" color="success.700" as={IoIosCheckmarkCircle} />
      ),
    });

  return { successToast };
};

export { useSettingsToast };
