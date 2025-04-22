import { useDisclosure } from '@chakra-ui/react';
import { useCallback } from 'react';

import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

const useDetailsDialog = () => {
  const detailsDialog = useDisclosure();
  const {
    screenSizes: { isMobile },
  } = useWorkspaceContext();

  const onOpen = useCallback(() => {
    if (!isMobile) return;

    detailsDialog.onOpen();
  }, [detailsDialog, isMobile]);

  return {
    ...detailsDialog,
    onOpen,
  };
};

export { useDetailsDialog };
