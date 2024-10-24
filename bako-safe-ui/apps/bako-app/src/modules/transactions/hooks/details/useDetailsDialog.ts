import { useDisclosure } from '@chakra-ui/react';

import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

const useDetailsDialog = () => {
  const detailsDialog = useDisclosure();
  const {
    screenSizes: { isMobile },
  } = useWorkspaceContext();

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
