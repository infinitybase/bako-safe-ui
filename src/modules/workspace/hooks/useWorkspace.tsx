import { Icon } from '@chakra-ui/icons';
import { useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { MdOutlineError } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom';

import { useAuth } from '@/modules/auth/hooks/useAuth';
import { useHomeDataRequest } from '@/modules/home/hooks/useHomeDataRequest';
import { useNotification } from '@/modules/notification';
import { useTransactionsSignaturePending } from '@/modules/transactions/hooks/list/useTotalSignaturesPendingRequest';

import { Pages } from '../../core';
import { PermissionRoles, Workspace } from '../../core/models';
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

  const worksapceBalance = useGetWorkspaceBalanceRequest();
  const pendingSignerTransactions = useTransactionsSignaturePending();
  const workspaceRequest = useGetCurrentWorkspace();
  const {
    workspaces: { current },
  } = useAuth();

  const { selectWorkspace } = useSelectWorkspace();

  const goWorkspace = (workspaceId: string) => {
    navigate(Pages.workspace({ workspaceId }));
  };

  const vaultsCounter = workspaceHomeRequest?.data?.predicates?.total ?? 0;

  const handleWorkspaceSelection = async (selectedWorkspace: Workspace) => {
    if (selectedWorkspace.id === current) {
      return;
    }

    selectWorkspace(selectedWorkspace.id, {
      onSelect: (workspace) => {
        workspaceDialog.onClose();
        workspaceHomeRequest.refetch();
        pendingSignerTransactions.refetch();
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

  // const [firstRender, setFirstRender] = useState<boolean>(true);
  // const [hasSkeleton, setHasSkeleton] = useState<boolean>(true);
  // const [hasSkeletonBalance, setHasSkeletonBalance] = useState<boolean>(true);

  // useTimeout(() => {
  //   setHasSkeleton(false);
  //   setFirstRender(false);
  // }, 3000);

  // useTimeout(() => setHasSkeletonBalance(false), 10000);

  // useMemo(() => {
  //   if (
  //     firstRender &&
  //     workspaceId !== workspaceHomeRequest.data?.workspace.id
  //   ) {
  //     setHasSkeleton(true);
  //     setFirstRender(false);
  //   }

  //   if (
  //     !firstRender &&
  //     workspaceId === workspaceHomeRequest.data?.workspace.id
  //   ) {
  //     setHasSkeleton(false);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [
  //   workspaceHomeRequest.isLoading,
  //   workspaceHomeRequest.isFetching,
  //   workspaceHomeRequest.isSuccess,
  // ]);

  // useMemo(() => {
  //   const workspacesInCookie = JSON.parse(
  //     CookiesConfig.getCookie(CookieName.WORKSPACE)!,
  //   ).id;
  //
  //   if (workspacesInCookie !== worksapceBalance.balance?.workspaceId) {
  //     setHasSkeletonBalance(true);
  //   }
  //
  //   if (workspacesInCookie === worksapceBalance.balance?.workspaceId) {
  //     setHasSkeletonBalance(false);
  //   }
  //
  //   // console.log('[WORKSPACE]: ', {
  //   //   HEADER: workspaceId,
  //   //   REQ_ATUAL: worksapceBalance.balance?.workspaceId,
  //   // });
  // }, [
  //   worksapceBalance.isLoading,
  //   worksapceBalance.isFetching,
  //   worksapceBalance.isSuccess,
  // ]);

  const hasPermission = (requiredRoles: PermissionRoles[]) => {
    const permissions = auth.userPermission;

    if (!permissions) return;

    const isValid =
      requiredRoles.filter(
        (p) =>
          (permissions[p] ?? []).includes('*') ||
          (permissions[p] ?? []).includes(vaultId!),
      ).length > 0;

    return isValid;
  };

  // todo: add an variable to verify all requests are in progress, and on the UI show a loading spinner using skeleton
  return {
    account: auth.account,
    currentWorkspace: workspaceRequest.workspace,
    currentPermissions: auth.permissions,
    userWorkspacesRequest,
    workspaceDialog,
    handleWorkspaceSelection,
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
    pendingSignerTransactions,
    goWorkspace,
  };
};

export { useWorkspace };
