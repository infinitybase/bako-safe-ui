import { useNavigate, useParams } from 'react-router-dom';

import { queryClient } from '@/config';
import { AddressBookQueryKey, Pages, WorkspacesQueryKey } from '@/modules/core';

import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

const useHome = () => {
  const navigate = useNavigate();
  const {
    authDetails,
    workspaceInfos: {
      workspaceHomeRequest,
      pendingSignerTransactions,
      selectWorkspace,
    },
  } = useWorkspaceContext();
  const { vaultId } = useParams();
  const vaultsPerPage = 8;

  const vaultsTotal = workspaceHomeRequest?.data?.predicates.total ?? 0;

  const goHome = () => {
    selectWorkspace(authDetails.workspaces.single, {
      onSelect: async () => {
        authDetails.handlers.authenticateWorkspaceSingle();
        await queryClient.invalidateQueries({
          queryKey: WorkspacesQueryKey.FULL_DATA(
            authDetails.workspaces.single,
            vaultId!,
          ),
        });
        await queryClient.invalidateQueries({
          queryKey: AddressBookQueryKey.LIST_BY_USER(
            authDetails.workspaces.single,
          ),
        });
        navigate(Pages.home());
      },
    });
  };

  return {
    account: authDetails.account,
    vaultsRequest: {
      ...workspaceHomeRequest,
      vaults: {
        recentVaults: workspaceHomeRequest.data?.predicates?.data,
        vaultsMax: vaultsPerPage,
        extraCount:
          vaultsTotal <= vaultsPerPage ? 0 : vaultsTotal - vaultsPerPage,
      },
      loadingRecentVaults: workspaceHomeRequest.isLoading,
      refetchVaults: workspaceHomeRequest.refetch,
    },
    transactionsRequest: {
      ...workspaceHomeRequest,
      loadingTransactions: workspaceHomeRequest.isLoading,
    },
    homeRequest: workspaceHomeRequest,
    navigate,
    goHome,
    pendingSignerTransactions,
  };
};

export { useHome };
