import { Icon } from '@chakra-ui/icons';
import { useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { MdOutlineError } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import { CookieName, CookiesConfig } from '@/config/cookies';
import { useFuelAccount } from '@/modules/auth/store';
import { useHomeDataRequest } from '@/modules/home/hooks/useHomeDataRequest';
import { useNotification } from '@/modules/notification';

import { Pages } from '../../core';
import { PermissionRoles, Workspace } from '../../core/models';
import { useSelectWorkspace } from './select';
import { useUserWorkspacesRequest } from './useUserWorkspacesRequest';

const { WORKSPACE, PERMISSIONS, SINGLE_WORKSPACE } = CookieName;

export type UseWorkspaceReturn = ReturnType<typeof useWorkspace>;

const useWorkspace = () => {
  const [visibleBalance, setVisibleBalance] = useState(false);
  const { account } = useFuelAccount();
  const workspaceDialog = useDisclosure();
  const toast = useNotification();
  const navigate = useNavigate();
  const singleCookie = CookiesConfig.getCookie(SINGLE_WORKSPACE);
  const currentCookie = CookiesConfig.getCookie(WORKSPACE);
  const permissionsCookie = CookiesConfig.getCookie(PERMISSIONS);
  const currentWorkspace: Workspace = currentCookie
    ? JSON.parse(currentCookie)
    : {};
  const currentPermissions: Workspace = permissionsCookie
    ? JSON.parse(permissionsCookie)
    : {};
  const singleWorkspace = singleCookie
    ? JSON.parse(CookiesConfig.getCookie(SINGLE_WORKSPACE)!)
    : {};
  const userWorkspacesRequest = useUserWorkspacesRequest();
  const workspaceHomeRequest = useHomeDataRequest();
  const vaultsPerPage = 8;

  const { selectWorkspace } = useSelectWorkspace();

  const vaultsCounter = workspaceHomeRequest?.data?.predicates?.total ?? 0;

  const handleWorkspaceSelection = async (selectedWorkspace: Workspace) => {
    if (selectedWorkspace.id === currentWorkspace.id) return;

    selectWorkspace(selectedWorkspace, {
      onSelect: (workspace) => {
        workspaceDialog.onClose();

        if (!workspace.single) {
          navigate(Pages.workspace({ workspaceId: workspace.id }));
        }
      },
      onError: () => {
        toast({
          status: 'error',
          duration: 4000,
          isClosable: false,
          title: 'Error!',
          description: 'Try again, please...',
          icon: <Icon fontSize="2xl" color="error.600" as={MdOutlineError} />,
        });
      },
    });
  };

  const hasPermission = (requiredRoles: PermissionRoles[]) => {
    const isValid =
      requiredRoles.filter((p) => (currentPermissions[p] ?? []).includes('*'))
        .length > 0;
    return isValid;
  };

  return {
    account,
    currentWorkspace,
    singleWorkspace,
    userWorkspacesRequest,
    workspaceDialog,
    handleWorkspaceSelection,
    navigate,
    workspaceHomeRequest,
    workspaceVaults: {
      recentVaults: workspaceHomeRequest.data?.predicates?.data,
      vaultsMax: vaultsPerPage,
      extraCount:
        vaultsCounter <= vaultsPerPage ? 0 : vaultsCounter - vaultsPerPage,
    },
    workspaceTransactions: {
      recentTransactions: workspaceHomeRequest.data?.transactions?.data,
    },
    currentPermissions,
    hasPermission,
    visibleBalance,
    setVisibleBalance,
  };
};

export { useWorkspace };
