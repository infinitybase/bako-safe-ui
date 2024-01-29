import { Icon } from '@chakra-ui/icons';
import { useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { BsFillCheckCircleFill } from 'react-icons/bs';
import { MdOutlineError } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import { CookieName, CookiesConfig } from '@/config/cookies';
import { useFuelAccount } from '@/modules/auth/store';
import { useNotification } from '@/modules/notification';

import { Pages } from '../../core';
import { PermissionRoles, Workspace } from '../../core/models';
import { useSelectWorkspaceRequest } from './useSelectWorkspaceRequest';
import { useUserWorkspacesRequest } from './useUserWorkspacesRequest';
import { useWorkspaceHomeRequest } from './useWorkspaceHomeRequest';

const { WORKSPACE, PERMISSIONS, SINGLE_WORKSPACE, USER_ID } = CookieName;

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
  const selectWorkspaceRequest = useSelectWorkspaceRequest();
  const vaultsPerPage = 8;
  const workspaceHomeRequest = useWorkspaceHomeRequest();

  const vaultsCounter = workspaceHomeRequest?.data?.predicates?.total ?? 0;

  const handleWorkspaceSelection = (selectedWorkspace: Workspace) => {
    if (selectedWorkspace.id === currentWorkspace.id) return;

    CookiesConfig.setCookies([
      {
        name: WORKSPACE,
        value: JSON.stringify(selectedWorkspace),
      },
      {
        name: PERMISSIONS,
        value: JSON.stringify(
          selectedWorkspace.permissions[CookiesConfig.getCookie(USER_ID)!],
        ),
      },
    ]);

    selectWorkspaceRequest.mutate(
      {
        workspace: selectedWorkspace.id,
        user: CookiesConfig.getCookie(USER_ID)!,
      },
      {
        onSuccess: ({ workspace }) => {
          if (!workspace.single) {
            toast({
              status: 'success',
              duration: 2000,
              title: 'Selected workspace!',
              icon: (
                <Icon
                  fontSize="2xl"
                  color="brand.500"
                  as={BsFillCheckCircleFill}
                />
              ),
            });

            workspaceDialog.onClose();
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
      },
    );
  };

  const hasPermission = (requiredRoles: PermissionRoles[]) => {
    const isValid =
      requiredRoles.filter((p) => currentPermissions[p].includes('*')).length >
      0;
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
