import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useListContactsRequest } from '@/modules/addressBook/hooks/useListContactsRequest';
import { useFuelAccount } from '@/modules/auth/store';
import { useTransactionsSignaturePending } from '@/modules/transactions/hooks/list';

import { useHomeDataRequest } from './useHomeDataRequest';

const useHome = () => {
  const navigate = useNavigate();
  const { account } = useFuelAccount();
  const vaultsPerPage = 8;
  const homeDataRequest = useHomeDataRequest();
  useListContactsRequest();

  const vaultsTotal = homeDataRequest?.data?.predicates.total ?? 0;
  const pendingSignerTransactions = useTransactionsSignaturePending();

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
    navigate,
    pendingSignerTransactions,
  };
};

export { useHome };
