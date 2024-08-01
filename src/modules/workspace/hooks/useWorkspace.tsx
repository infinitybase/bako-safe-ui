import { Icon } from '@chakra-ui/icons';
import { useDisclosure } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { MdOutlineError } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom';

import { useHomeDataRequest } from '@/modules/home/hooks/useHomeDataRequest';
import { useNotification } from '@/modules/notification';
import { useTransactionsSignaturePending } from '@/modules/transactions/hooks/list';

import { Pages } from '../../core';
import { PermissionRoles } from '../../core/models';
import { useGetWorkspaceRequest } from '../hooks/useGetWorkspaceRequest';
import { useSelectWorkspace } from './select';
import { useGetWorkspaceBalanceRequest } from './useGetWorkspaceBalanceRequest';
import { useUserWorkspacesRequest } from './useUserWorkspacesRequest';
import { IUseAuthReturn } from '@/modules/auth/services';

const VAULTS_PER_PAGE = 8;

export type UseWorkspaceReturn = ReturnType<typeof useWorkspace>;

const useWorkspace = (auth: IUseAuthReturn) => {
  const navigate = useNavigate();
  const { workspaceId, vaultId } = useParams();

  const [visibleBalance, setVisibleBalance] = useState(false);

  const toast = useNotification();
  const workspaceDialog = useDisclosure();
  const pendingSignerTransactions = useTransactionsSignaturePending();

  const worksapceBalance = useGetWorkspaceBalanceRequest(
    auth.workspaces.current,
  );

  const workspaceHomeRequest = useHomeDataRequest(auth.workspaces.current);
  const userWorkspacesRequest = useUserWorkspacesRequest();
  const singleWorkspace = useGetWorkspaceRequest(auth.workspaces.single);
  const currentWorkspaceRequest = useGetWorkspaceRequest(
    auth.workspaces.current,
  );
  const {
    workspaces: { current },
  } = auth;

  const { selectWorkspace, isSelecting } = useSelectWorkspace(auth);

  const goWorkspace = (workspaceId: string) => {
    navigate(Pages.workspace({ workspaceId }));
    return '';
  };

  const vaultsCounter = workspaceHomeRequest?.data?.predicates?.total ?? 0;

  const handleWorkspaceSelection = async (selectedWorkspace: string) => {
    if (selectedWorkspace === current || isSelecting) {
      return;
    }

    await currentWorkspaceRequest.refetch();

    selectWorkspace(selectedWorkspace, {
      onSelect: (workspace) => {
        workspaceDialog.onClose();
        if (!workspace.single) {
          goWorkspace(workspace.id);
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

  const hasPermission = useCallback(
    (requiredRoles: PermissionRoles[]) => {
      if (auth.isSingleWorkspace) return true;

      const permissions = auth.permissions;

      if (!permissions) return false;

      const isValid =
        requiredRoles.filter(
          (p) =>
            (permissions[p] ?? []).includes('*') ||
            (permissions[p] ?? []).includes(vaultId!),
        ).length > 0;

      return isValid;
    },
    [auth.isSingleWorkspace, auth.permissions, vaultId],
  );

  // separe as infos:

  //    - account
  //        - provider
  //        - infos gerais:
  //            - accountType
  //            - avatar
  //            - userId
  //            - account
  //            - webAuthn
  //    - currentWorkspace
  //        - infos gerais:
  //            - workspaceId
  //            - permissions
  //            - avatar
  //        - adb
  //        - balance
  //        - vaults (home)
  //        - tx:
  //            - pending
  //            - home

  return {
    account: auth.account,
    currentWorkspace: {
      workspace: currentWorkspaceRequest.workspace,
      isLoading: currentWorkspaceRequest.isLoading,
    },
    currentPermissions: auth.permissions,
    userWorkspacesRequest,
    workspaceDialog,
    handleWorkspaceSelection: {
      handler: handleWorkspaceSelection,
      isSelecting,
    },
    navigate,
    workspaceHomeRequest,
    singleWorkspace,
    workspaceId,
    workspaceVaults: {
      recentVaults: workspaceHomeRequest.data?.predicates?.data,
      vaultsMax: VAULTS_PER_PAGE,
      extraCount:
        vaultsCounter <= VAULTS_PER_PAGE ? 0 : vaultsCounter - VAULTS_PER_PAGE,
    },
    worksapceBalance,

    visibleBalance,
    pendingSignerTransactions,
    goWorkspace,
    selectWorkspace,
    setVisibleBalance,
    hasPermission,
  };
};

export { useWorkspace };
