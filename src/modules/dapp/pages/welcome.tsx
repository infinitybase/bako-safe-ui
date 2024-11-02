import { useEffect, useState } from 'react';

import { useQueryParams } from '@/modules';
import { useUpdateSettingsRequest } from '@/modules/settings/hooks';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { WelcomeDepositDialog } from '../components/welcome/depositDialog';
import { WelcomeDialogDapp } from '../components/welcome/mainDialog';
import { useAuthSocket } from '../hooks';

const DappWelcomeDialog = () => {
  const [isWelcomeDialogOpen, setIsWelcomeDialogOpen] = useState(true);
  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false);
  const { name, origin, sessionId, request_id } = useQueryParams();
  const { send } = useAuthSocket();

  const {
    authDetails: {
      userInfos: { id, address },
    },
    userVaults: {
      request: { vaults },
    },
  } = useWorkspaceContext();

  const updateUserMutation = useUpdateSettingsRequest();

  useEffect(() => {
    updateUserMutation.mutate({ id, first_login: false });

    if (
      vaults[0]?.id &&
      !send.isPending &&
      name &&
      origin &&
      sessionId &&
      request_id &&
      address
    ) {
      send.mutate({
        name: name,
        origin: origin,
        sessionId: sessionId,
        request_id: request_id,
        vaultId: vaults[0].id,
        userAddress: address,
      });
    }
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
