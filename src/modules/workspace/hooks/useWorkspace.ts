import { useDisclosure } from '@chakra-ui/react';

import { CookieName, CookiesConfig } from '@/config/cookies';
import { useFuelAccount } from '@/modules/auth';
import { Workspace } from '@/modules/core';

import { useUserWorkspacesRequest } from './useUserWorkspacesRequest';

export type UseWorkspaceReturn = ReturnType<typeof useWorkspace>;

const useWorkspace = () => {
  const { account } = useFuelAccount();
  const userWorkspacesRequest = useUserWorkspacesRequest(account);
  const workspace = CookiesConfig.getCookie(CookieName.WORKSPACE);
  const currentWorkspace: Workspace = workspace ? JSON.parse(workspace) : {};
  const workspaceDialog = useDisclosure();

  return {
    currentWorkspace,
    userWorkspacesRequest,
    workspaceDialog,
  };
};

export { useWorkspace };
