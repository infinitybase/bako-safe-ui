import { useDisclosure } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { queryClient } from '@/config';
import { IUserInfos } from '@/modules/auth/services';
import { useHomeDataRequest } from '@/modules/home/hooks/useHomeDataRequest';

// import { useNotification } from '@/modules/notification';
import { Pages } from '../../core';
import { PermissionRoles, WorkspacesQueryKey } from '../../core/models';
// import { useSelectWorkspace } from './select';
import { useGetWorkspaceBalanceRequest } from './useGetWorkspaceBalanceRequest';

const VAULTS_PER_PAGE = 8;

export type UseWorkspaceReturn = ReturnType<typeof useWorkspace>;

const useWorkspace = (
  userInfos: IUserInfos,
  invalidateGifAnimationRequest: () => void,
  resetAllTransactionsTypeFilters: () => void,
  refetchPendingSingerTransactions: () => void,
) => {
  const navigate = useNavigate();
  const { workspaceId, vaultId } = useParams();

  const [visibleBalance, setVisibleBalance] = useState(false);

  // const toast = useNotification();
  const workspaceDialog = useDisclosure();

  const workspaceBalance = useGetWorkspaceBalanceRequest(
    userInfos?.workspace?.id,
  );

  const latestPredicates = useHomeDataRequest(userInfos?.workspace?.id);

  // const { selectWorkspace, isSelecting } = useSelectWorkspace(userInfos.id);

  const vaultsCounter = latestPredicates?.data?.predicates?.total ?? 0;

  const handleWorkspaceSelection = async (
    selectedWorkspace: string,
    redirect?: string,
    needUpdateWorkspaceBalance?: boolean,
  ) => {
    const isValid = selectedWorkspace !== userInfos?.workspace?.id;

    // if (isSelecting) return;
    if (!isValid) {
      !!redirect && navigate(redirect);
      if (redirect?.includes('vault')) {
        // That' means he's accessing a vault, then it should show the gif.
        invalidateGifAnimationRequest();
      }
      needUpdateWorkspaceBalance && workspaceBalance.refetch();
      return;
    }

    invalidateGifAnimationRequest();
    workspaceDialog.onClose();
    invalidateRequests();
    navigate(
      redirect ?? Pages.workspace({ workspaceId: selectedWorkspace ?? '' }),
    );

    // Commented out this workspace select/auth logic.
    // Now we only use navigate to redirect the user instead of authenticate him in the workspace

    // selectWorkspace(selectedWorkspace, {
    //   onSelect: (workspace) => {
    //     invalidateRequests();
    //     navigate(redirect ?? Pages.workspace({ workspaceId: workspace.id }));
    //   },
    //   onError: () => {
    //     toast({
    //       status: 'error',
    //       duration: 4000,
    //       isClosable: false,
    //       title: 'Error!',
    //       description: 'Try again, please...',
    //       icon: <Icon fontSize="2xl" color="error.600" as={MdOutlineError} />,
    //     });
    //   },
    // });
  };

  const goHome = () => {
    queryClient.invalidateQueries({
      queryKey: WorkspacesQueryKey.LIST_BY_USER(),
    });
    handleWorkspaceSelection(userInfos.singleWorkspaceId, Pages.home());
  };

  const hasPermission = useCallback(
    (requiredRoles: PermissionRoles[]) => {
      if (userInfos.onSingleWorkspace) return true;

      const permissions = userInfos.workspace?.permission;

      if (!permissions) return false;

      const isValid =
        requiredRoles.filter(
          (p) =>
            (permissions[p] ?? []).includes('*') ||
            (permissions[p] ?? []).includes(vaultId!),
        ).length > 0;

      return isValid;
    },
    [userInfos?.onSingleWorkspace, userInfos.workspace?.permission, vaultId],
  );

  const invalidateRequests = () => {
    resetAllTransactionsTypeFilters();
    workspaceBalance.refetch();
    refetchPendingSingerTransactions();
    userInfos.refetch();
  };

  return {
    workspaceDialog,
    workspaceVaults: {
      vaultsMax: VAULTS_PER_PAGE,
      extraCount:
        vaultsCounter <= VAULTS_PER_PAGE ? 0 : vaultsCounter - VAULTS_PER_PAGE,
    },
    requests: {
      latestPredicates,
      workspaceBalance,
    },
    infos: {
      workspaceId,
      visibleBalance,
      isSelecting: false,
      currentPermissions: userInfos.workspace?.permission,
    },
    handlers: {
      handleWorkspaceSelection,
      navigate,
      setVisibleBalance,
      hasPermission,
      goHome,
    },
  };
};

export { useWorkspace };
