import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { queryClient } from '@/config';
import { useListContactsRequest } from '@/modules/addressBook/hooks/useListContactsRequest';
import { useAuth } from '@/modules/auth/hooks';
import { useAuthStore } from '@/modules/auth/store';
import { HomeQueryKey, Pages } from '@/modules/core';
import { useTransactionsSignaturePending } from '@/modules/transactions/hooks/list';
import { useSelectWorkspace } from '@/modules/workspace';

import { useHomeDataRequest } from './useHomeDataRequest';

const useHome = () => {
  const auth = useAuth();

  const navigate = useNavigate();
  const { account } = useAuthStore();
  const vaultsPerPage = 8;
  const homeDataRequest = useHomeDataRequest();
  useListContactsRequest();

  const vaultsTotal = homeDataRequest?.data?.predicates.total ?? 0;
  const pendingSignerTransactions = useTransactionsSignaturePending();
  const { selectWorkspace } = useSelectWorkspace();

  const goHome = () => {
    selectWorkspace(auth.workspaces.single, {
      onSelect: async () => {
        auth.handlers.authenticateWorkspaceSingle();
        await queryClient.invalidateQueries(
          HomeQueryKey.FULL_DATA(auth.workspaces.single),
        );
        navigate(Pages.home());
      },
    });
  };

  useEffect(() => {
    document.getElementById('top')?.scrollIntoView();
  }, []);

  return {
    account,
    vaultsRequest: {
      ...homeDataRequest,
      vaults: {
        recentVaults: homeDataRequest.data?.predicates?.data,
        vaultsMax: vaultsPerPage,
        extraCount:
          vaultsTotal <= vaultsPerPage ? 0 : vaultsTotal - vaultsPerPage,
      },
      loadingRecentVaults: homeDataRequest.isLoading,
      refetchVaults: homeDataRequest.refetch,
    },
    transactionsRequest: {
      ...homeDataRequest,
      transactions: homeDataRequest.data?.transactions?.data,
      loadingTransactions: homeDataRequest.isLoading,
    },
    homeRequest: homeDataRequest,
    navigate,
    goHome,
    pendingSignerTransactions,
  };
};

export { useHome };
