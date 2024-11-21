import { useEffect, useState } from 'react';

import { useUpdateSettingsRequest } from '@/modules/settings/hooks';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { WelcomeDepositDialog } from '../components/welcome/depositDialog';
import { WelcomeDialogDapp } from '../components/welcome/mainDialog';

const DappWelcomeDialog = () => {
  const [isWelcomeDialogOpen, setIsWelcomeDialogOpen] = useState(true);
  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false);

  const {
    authDetails: {
      userInfos: { id },
    },
  } = useWorkspaceContext();

  const updateUserMutation = useUpdateSettingsRequest();

  useEffect(() => {
    updateUserMutation.mutate({ id, first_login: false });
  }, []);

  return (
    <>
      <WelcomeDepositDialog
        setIsDepositDialogOpen={setIsDepositDialogOpen}
        setIsWelcomeDialogOpen={setIsWelcomeDialogOpen}
        isDepositDialogOpen={isDepositDialogOpen}
      />

      <WelcomeDialogDapp
        isWelcomeDialogOpen={isWelcomeDialogOpen}
        setIsDepositDialogOpen={setIsDepositDialogOpen}
        setIsWelcomeDialogOpen={setIsWelcomeDialogOpen}
      />
    </>
  );
};

export { DappWelcomeDialog };
