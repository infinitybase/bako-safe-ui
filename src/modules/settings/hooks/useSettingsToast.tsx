import { Icon } from '@chakra-ui/icons';
import { BsFillCheckCircleFill } from 'react-icons/bs';

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
        <Icon fontSize="2xl" color="brand.500" as={BsFillCheckCircleFill} />
      ),
    });

  return { successToast };
};

export { useSettingsToast };
