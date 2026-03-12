import { useCallback } from 'react';

import { useDisclosure } from '@/modules/core/hooks/useDisclosure';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

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
