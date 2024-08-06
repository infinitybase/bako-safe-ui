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

const useWorkspace = (authDetails: IUseAuthReturn) => {
  const navigate = useNavigate();
  const { workspaceId, vaultId } = useParams();

  const [visibleBalance, setVisibleBalance] = useState(false);

  const toast = useNotification();
  const workspaceDialog = useDisclosure();
  const pendingSignerTransactions = useTransactionsSignaturePending();

  const worksapceBalance = useGetWorkspaceBalanceRequest(
    authDetails.userInfos?.workspace?.id,
  );

  const predicatesHomeRequest = useHomeDataRequest(
    authDetails.userInfos?.workspace?.id,
  );
  const userWorkspacesRequest = useUserWorkspacesRequest();

  const currentWorkspaceRequest = useGetWorkspaceRequest(
    authDetails.userInfos?.workspace?.id,
  );

  const { selectWorkspace, isSelecting } = useSelectWorkspace(
    authDetails.userInfos.id,
  );

  const goWorkspace = (workspaceId: string) => {
    navigate(Pages.workspace({ workspaceId }));
    return '';
  };

  const vaultsCounter = predicatesHomeRequest?.data?.predicates?.total ?? 0;

  const handleWorkspaceSelection = async (
    selectedWorkspace: string,
    redirect?: string,
  ) => {
    const isValid = selectedWorkspace !== authDetails.userInfos?.workspace?.id;

    if (isSelecting) return;
    if (!isValid) return !!redirect && navigate(redirect);

    selectWorkspace(selectedWorkspace, {
      onSelect: (workspace) => {
        workspaceDialog.onClose();
        invalidateRequests();
        navigate(redirect ?? Pages.workspace({ workspaceId: workspace.id }));
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
      if (authDetails.userInfos.onSingleWorkspace) return true;

      const permissions = authDetails.userInfos.workspace?.permission;

      if (!permissions) return false;

      const isValid =
        requiredRoles.filter(
          (p) =>
            (permissions[p] ?? []).includes('*') ||
            (permissions[p] ?? []).includes(vaultId!),
        ).length > 0;

      return isValid;
    },
    [
      authDetails.userInfos?.onSingleWorkspace,
      authDetails.userInfos.workspace?.permission,
      vaultId,
    ],
  );

  const invalidateRequests = () => {
    worksapceBalance.refetch();
    predicatesHomeRequest.refetch();
    authDetails.userInfos.refetch();
  };

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
    account: authDetails.userInfos.address,
    currentWorkspace: {
      workspace: currentWorkspaceRequest.workspace,
      isLoading: currentWorkspaceRequest.isLoading,
    },
    currentPermissions: authDetails.userInfos.workspace?.permission,
    userWorkspacesRequest,
    workspaceDialog,
    handleWorkspaceSelection: {
      handler: handleWorkspaceSelection,
      isSelecting,
    },
    navigate,
    predicatesHomeRequest,
    workspaceId,
    workspaceVaults: {
      recentVaults: predicatesHomeRequest.data?.predicates?.data,
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
