import { useNavigate, useParams } from 'react-router-dom';

import { queryClient } from '@/config';
import { AddressBookQueryKey, Pages, WorkspacesQueryKey } from '@/modules/core';

import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

const useHome = () => {
  const navigate = useNavigate();
  const {
    authDetails: { userInfos },
    workspaceInfos: {
      predicatesHomeRequest,
      pendingSignerTransactions,
      selectWorkspace,
    },
  } = useWorkspaceContext();

  const { vaultId } = useParams();
  const vaultsPerPage = 8;

  const vaultsTotal = predicatesHomeRequest?.data?.predicates.total ?? 0;

  const goHome = () => {
    selectWorkspace(userInfos.singleWorkspaceId, {
      onSelect: async () => {
        predicatesHomeRequest.refetch();
        await queryClient.invalidateQueries({
          queryKey: WorkspacesQueryKey.FULL_DATA(
            userInfos.singleWorkspaceId,
            vaultId!,
          ),
        });
        await queryClient.invalidateQueries({
          queryKey: AddressBookQueryKey.LIST_BY_USER(
            userInfos.singleWorkspaceId,
          ),
        });
        navigate(Pages.home());
      },
    });
  };

  return {
    account: userInfos?.address,
    vaultsRequest: {
      ...predicatesHomeRequest,
      vaults: {
        recentVaults: predicatesHomeRequest.data?.predicates?.data,
        vaultsMax: vaultsPerPage,
        extraCount:
          vaultsTotal <= vaultsPerPage ? 0 : vaultsTotal - vaultsPerPage,
      },
      loadingRecentVaults: predicatesHomeRequest.isLoading,
      refetchVaults: predicatesHomeRequest.refetch,
    },
    transactionsRequest: {
      ...predicatesHomeRequest,
      loadingTransactions: predicatesHomeRequest.isLoading,
    },
    homeRequest: predicatesHomeRequest,
    navigate,
    goHome,
    pendingSignerTransactions,
  };
};

export { useHome };
