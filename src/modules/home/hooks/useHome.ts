import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useListContactsRequest } from '@/modules/addressBook/hooks/useListContactsRequest';
import { useAuth } from '@/modules/auth/hooks';
import { useAuthStore } from '@/modules/auth/store';
import { HomeQueryKey, invalidateQueries, Pages } from '@/modules/core';
import { useTransactionsSignaturePending } from '@/modules/transactions/hooks/list';

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

  const goHome = () => {
    invalidateQueries(HomeQueryKey.FULL_DATA());
    auth.handlers.authenticateWorkspaceSingle();
    navigate(Pages.home());
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
