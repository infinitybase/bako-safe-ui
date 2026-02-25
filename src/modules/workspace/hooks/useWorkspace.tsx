import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { queryClient } from '@/config';
import { IUserInfos } from '@/modules/auth/services';
import { useDisclosure } from '@/modules/core/hooks/useDisclosure';
import { useHomeDataRequest } from '@/modules/home/hooks/useHomeDataRequest';

// import { useNotification } from '@/modules/notification';
import {
  AssetMap,
  Pages,
  SocketEvents,
  SocketRealTimeNotifications,
  SocketUsernames,
  useSocket,
} from '../../core';
import { PermissionRoles, WorkspacesQueryKey } from '../../core/models';
// import { useSelectWorkspace } from './select';
import { useGetWorkspaceBalanceRequest } from './useGetWorkspaceBalanceRequest';

type HandleWithSocketEventProps = {
  sessionId: string;
  to: string;
  type: string;
};

const VAULTS_PER_PAGE = 6;

export type UseWorkspaceReturn = ReturnType<typeof useWorkspace>;

const useWorkspace = (
  userInfos: IUserInfos,
  assetsMaps: false | AssetMap | undefined,
  // invalidateGifAnimationRequest: () => void,
  // resetAllTransactionsTypeFilters: () => void,
  // refetchPendingSingerTransactions: () => void,
) => {
  const navigate = useNavigate();
  const { workspaceId, vaultId } = useParams();
  const { socket } = useSocket();

  const [visibleBalance, setVisibleBalance] = useState(false);

  // const toast = useNotification();
  const workspaceDialog = useDisclosure();

  const workspaceBalance = useGetWorkspaceBalanceRequest(
    userInfos?.workspace?.id,
    assetsMaps,
  );

  const latestPredicates = useHomeDataRequest(userInfos?.workspace?.id);

  // const { selectWorkspace, isSelecting } = useSelectWorkspace(userInfos.id);

  const vaultsCounter = latestPredicates?.data?.predicates?.total ?? 0;

  const handleWorkspaceSelection = useCallback(
    async (
      selectedWorkspace: string,
      redirect?: string,
      // needUpdateWorkspaceBalance?: boolean,
    ) => {
      // All this logic is to handle workspace authentication
      // const isValid = selectedWorkspace !== userInfos?.workspace?.id;
      // if (!isValid) {
      //   console.log(!!redirect);
      //   !!redirect && navigate(redirect);
      //   if (redirect?.includes('vault')) {
      //     // That' means he's accessing a vault, then it should show the gif.
      //     invalidateGifAnimationRequest();
      //   }
      //   needUpdateWorkspaceBalance && workspaceBalance.refetch();
      //   return;
      // }
      // workspaceDialog.onClose();

      redirect && navigate(redirect);

      // This logic below is to show the gif animation when the user enters in some vault
      // if (redirect) {
      //   if (redirect.includes('vault')) {
      //     invalidateGifAnimationRequest();
      //   }
      //   navigate(redirect);
      // }
    },
    [navigate],
  );

  const goHome = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: WorkspacesQueryKey.LIST_BY_USER(),
    });
    handleWorkspaceSelection(userInfos.singleWorkspaceId, Pages.home());
  }, [userInfos.singleWorkspaceId, handleWorkspaceSelection]);

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

  const handleWithSocketEvent = ({ to, type }: HandleWithSocketEventProps) => {
    const isValid =
      to === SocketUsernames.UI && type === SocketRealTimeNotifications.VAULT;
    if (isValid) {
      workspaceBalance.refetch();
      latestPredicates.refetch();
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    socket.on(SocketEvents.NOTIFICATION, handleWithSocketEvent);

    return () => {
      socket.off(SocketEvents.NOTIFICATION, handleWithSocketEvent);
    };
  }, []);

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
