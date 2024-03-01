import { useDisclosure } from '@chakra-ui/react';

import { useScreenSize } from '@/modules/core/hooks';

const useDetailsDialog = () => {
  const detailsDialog = useDisclosure();
  const { isMobile } = useScreenSize();

  const onOpen = () => {
    if (!isMobile) return;

    detailsDialog.onOpen();
  };

  return {
    ...detailsDialog,
    onOpen,
  };
};

export { useDetailsDialog };
