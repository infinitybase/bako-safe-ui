import { Dialog } from '@ui/components';

import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

const BaseDialog = () => {
  const {
    screenSizes: { isMobile },
  } = useWorkspaceContext();
  return <Dialog isMobile={isMobile}></Dialog>;
};

export default BaseDialog;
