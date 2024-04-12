import { Icon } from '@chakra-ui/icons';
import { useDisclosure } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { MdOutlineError } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom';

import { useAuth } from '@/modules/auth/hooks/useAuth';
import { useHomeDataRequest } from '@/modules/home/hooks/useHomeDataRequest';
import { useNotification } from '@/modules/notification';
import { useTransactionsSignaturePending } from '@/modules/transactions';

import { Pages } from '../../core';
import { PermissionRoles } from '../../core/models';
import { useGetCurrentWorkspace } from '../hooks/useGetWorkspaceRequest';
import { useSelectWorkspace } from './select';
import { useGetWorkspaceBalanceRequest } from './useGetWorkspaceBalanceRequest';
import { useUserWorkspacesRequest } from './useUserWorkspacesRequest';

const VAULTS_PER_PAGE = 8;

export type UseWorkspaceReturn = ReturnType<typeof useWorkspace>;

const useWorkspace = () => {
  const navigate = useNavigate();
  const { workspaceId, vaultId } = useParams();

  const auth = useAuth();

  const [visibleBalance, setVisibleBalance] = useState(false);

  const toast = useNotification();
  const workspaceDialog = useDisclosure();

  const workspaceHomeRequest = useHomeDataRequest();
  const userWorkspacesRequest = useUserWorkspacesRequest();
  const pendingSignerTransactions = useTransactionsSignaturePending();

  const worksapceBalance = useGetWorkspaceBalanceRequest();
  const workspaceRequest = useGetCurrentWorkspace();
  const {
    workspaces: { current },
  } = useAuth();

  const { selectWorkspace, isSelecting } = useSelectWorkspace();

  const goWorkspace = (workspaceId: string) => {
    navigate(Pages.workspace({ workspaceId }));
  };

  const vaultsCounter = workspaceHomeRequest?.data?.predicates?.total ?? 0;

  const handleWorkspaceSelection = async (selectedWorkspace: string) => {
    if (selectedWorkspace === current || isSelecting) {
      return;
    }

    await workspaceRequest.refetch();

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

  return {
    account: auth.account,
    currentWorkspace: {
      workspace: workspaceRequest.workspace,
      isLoading: workspaceRequest.isLoading,
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
    workspaceId,
    workspaceVaults: {
      recentVaults: workspaceHomeRequest.data?.predicates?.data,
      vaultsMax: VAULTS_PER_PAGE,
      extraCount:
        vaultsCounter <= VAULTS_PER_PAGE ? 0 : vaultsCounter - VAULTS_PER_PAGE,
    },
    workspaceTransactions: {
      recentTransactions: workspaceHomeRequest.data?.transactions?.data,
    },
    worksapceBalance,
    hasPermission,
    visibleBalance,
    setVisibleBalance,
    goWorkspace,
    pendingSignerTransactions,
  };
};

export { useWorkspace };
