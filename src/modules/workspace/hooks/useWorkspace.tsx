import { Icon } from '@chakra-ui/icons';
import { useDisclosure } from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { MdOutlineError } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom';

import { CookieName, CookiesConfig } from '@/config/cookies';
import { useFuelAccount } from '@/modules/auth/store';
import { invalidateQueries } from '@/modules/core/utils';
import { useHomeDataRequest } from '@/modules/home/hooks/useHomeDataRequest';
import { useNotification } from '@/modules/notification';
import { useTransactionsSignaturePending } from '@/modules/transactions/hooks/list/useTotalSignaturesPendingRequest';

import { Pages } from '../../core';
import {
  PermissionRoles,
  Workspace,
  WorkspacesQueryKey,
} from '../../core/models';
import { useSelectWorkspace } from './select';
import { useGetWorkspaceBalanceRequest } from './useGetWorkspaceBalanceRequest';
import { useUserWorkspacesRequest } from './useUserWorkspacesRequest';

const { WORKSPACE, PERMISSIONS, SINGLE_WORKSPACE } = CookieName;

export type UseWorkspaceReturn = ReturnType<typeof useWorkspace>;

const useWorkspace = () => {
  const [visibleBalance, setVisibleBalance] = useState(false);
  const { workspaceId } = useParams();
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
  const worksapceBalance = useGetWorkspaceBalanceRequest();
  const pendingSignerTransactions = useTransactionsSignaturePending();

  const { selectWorkspace } = useSelectWorkspace();

  const goWorkspace = (workspaceId: string) => {
    invalidateQueries(WorkspacesQueryKey.FULL_DATA());
    navigate(Pages.workspace({ workspaceId }));
  };

  const vaultsCounter = workspaceHomeRequest?.data?.predicates?.total ?? 0;

  const handleWorkspaceSelection = async (selectedWorkspace: Workspace) => {
    if (selectedWorkspace.id === currentWorkspace.id) {
      return;
    }

    selectWorkspace(selectedWorkspace, {
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

  const [firstRender, setFirstRender] = useState<boolean>(true);
  const [hasSkeleton, setHasSkeleton] = useState<boolean>(false);
  const [hasSkeletonBalance, setHasSkeletonBalance] = useState<boolean>(false);

  useMemo(() => {
    if (
      firstRender &&
      workspaceId !== workspaceHomeRequest.data?.workspace.id
    ) {
      setHasSkeleton(true);
      setFirstRender(false);
    }

    if (
      !firstRender &&
      workspaceId === workspaceHomeRequest.data?.workspace.id
    ) {
      setHasSkeleton(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    workspaceHomeRequest.isLoading,
    workspaceHomeRequest.isFetching,
    workspaceHomeRequest.isSuccess,
  ]);

  useMemo(() => {
    const workspacesInCookie = JSON.parse(
      CookiesConfig.getCookie(CookieName.WORKSPACE)!,
    ).id;

    if (workspacesInCookie !== worksapceBalance.balance?.workspaceId) {
      setHasSkeletonBalance(true);
    }

    if (workspacesInCookie === worksapceBalance.balance?.workspaceId) {
      setHasSkeletonBalance(false);
    }

    // console.log('[WORKSPACE]: ', {
    //   HEADER: workspaceId,
    //   REQ_ATUAL: worksapceBalance.balance?.workspaceId,
    // });
  }, [
    worksapceBalance.isLoading,
    worksapceBalance.isFetching,
    worksapceBalance.isSuccess,
  ]);

  const hasPermission = (requiredRoles: PermissionRoles[]) => {
    const isValid =
      requiredRoles.filter((p) => (currentPermissions[p] ?? []).includes('*'))
        .length > 0;
    return isValid;
  };

  // todo: add an variable to verify all requests are in progress, and on the UI show a loading spinner using skeleton
  return {
    account,
    currentWorkspace,
    singleWorkspace,
    userWorkspacesRequest,
    workspaceDialog,
    handleWorkspaceSelection,
    navigate,
    workspaceHomeRequest,
    workspaceId,
    workspaceVaults: {
      recentVaults: workspaceHomeRequest.data?.predicates?.data,
      vaultsMax: vaultsPerPage,
      extraCount:
        vaultsCounter <= vaultsPerPage ? 0 : vaultsCounter - vaultsPerPage,
    },
    workspaceTransactions: {
      recentTransactions: workspaceHomeRequest.data?.transactions?.data,
    },
    worksapceBalance,
    currentPermissions,
    hasPermission,
    visibleBalance,
    setVisibleBalance,
    hasSkeleton,
    hasSkeletonBalance,
    pendingSignerTransactions,
    goWorkspace,
  };
};

export { useWorkspace };
