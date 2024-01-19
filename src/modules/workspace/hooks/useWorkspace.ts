import { useDisclosure } from '@chakra-ui/react';

import { CookieName, CookiesConfig } from '@/config/cookies';
import { useFuelAccount } from '@/modules/auth';
import { Workspace } from '@/modules/core';
import { useNotification } from '@/modules/notification';

import { useSelectWorkspaceRequest } from './useSelectWorkspaceRequest';
import { useUserWorkspacesRequest } from './useUserWorkspacesRequest';

const { WORKSPACE, PERMISSIONS } = CookieName;

export type UseWorkspaceReturn = ReturnType<typeof useWorkspace>;

const useWorkspace = () => {
  const { account } = useFuelAccount();
  const workspaceDialog = useDisclosure();
  const workspace = CookiesConfig.getCookie(WORKSPACE);
  const currentWorkspace: Workspace = workspace ? JSON.parse(workspace) : {};
  const userWorkspacesRequest = useUserWorkspacesRequest(account);
  const selectWorkspaceRequest = useSelectWorkspaceRequest();
  const toast = useNotification({ variant: 'success' });

  const handleWorkspaceSelection = (workspace: Workspace) => {
    selectWorkspaceRequest.mutate(
      {
        workspace_id: workspace.id,
        address: account,
        token: CookiesConfig.getCookie(CookieName.ACCESS_TOKEN)!,
      },
      {
        onSuccess: ({ workspace }) => {
          CookiesConfig.setCookies([
            {
              name: WORKSPACE,
              value: JSON.stringify(workspace),
            },
            {
              name: PERMISSIONS,
              value: JSON.stringify(workspace.permissions),
            },
          ]);

          toast({ description: 'ok' });

          workspaceDialog.onClose();
        },
        onError: () => {},
      },
    );
  };

  return {
    currentWorkspace,
    userWorkspacesRequest,
    workspaceDialog,
    handleWorkspaceSelection,
  };
};

export { useWorkspace };
