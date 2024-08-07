import { useNavigate, useParams } from 'react-router-dom';

import { queryClient } from '@/config';
import { AddressBookQueryKey, Pages, WorkspacesQueryKey } from '@/modules/core';

import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

const useHome = () => {
  const navigate = useNavigate();
  const {
    authDetails: { userInfos },
    workspaceInfos: {
      requests: { latestPredicates, pendingSignerTransactions },
      handlers: { handleWorkspaceSelection },
    },
  } = useWorkspaceContext();

  const vaultsPerPage = 8;

  const vaultsTotal = latestPredicates?.data?.predicates.total ?? 0;

  const goHome = () => {
    handleWorkspaceSelection(userInfos.singleWorkspaceId, Pages.home());
  };

  return {
    account: userInfos?.address,
    vaultsRequest: {
      ...latestPredicates,
      vaults: {
        recentVaults: latestPredicates.data?.predicates?.data,
        vaultsMax: vaultsPerPage,
        extraCount:
          vaultsTotal <= vaultsPerPage ? 0 : vaultsTotal - vaultsPerPage,
      },
      loadingRecentVaults: latestPredicates.isLoading,
      refetchVaults: latestPredicates.refetch,
    },
    transactionsRequest: {
      ...latestPredicates,
      loadingTransactions: latestPredicates.isLoading,
    },
    homeRequest: latestPredicates,
    navigate,
    goHome,
    pendingSignerTransactions,
  };
};

export { useHome };
