import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { queryClient } from '@/config';
import { CookieName, CookiesConfig } from '@/config/cookies';
import { useListContactsRequest } from '@/modules/addressBook/hooks';
import { useFuelAccount } from '@/modules/auth/store';
import { TRANSACTION_LIST_QUERY_KEY } from '@/modules/transactions/hooks';
import { VAULT_LIST_QUERY_KEY } from '@/modules/vault';

import { useHomeDataRequest } from './useHomeDataRequest';

const useHome = () => {
  const navigate = useNavigate();
  const { account } = useFuelAccount();
  const vaultsPerPage = 8;
  const homeDataRequest = useHomeDataRequest();
  const { isLoading: loadingContacts, data: contacts } =
    useListContactsRequest();

  const vaultsTotal = homeDataRequest?.data?.predicates.total ?? 0;

  if (!loadingContacts) {
    CookiesConfig.setCookies([
      {
        name: CookieName.SINGLE_CONTACTS,
        value: JSON.stringify(contacts),
      },
    ]);
  }

  useEffect(() => {
    document.getElementById('top')?.scrollIntoView();
    queryClient.invalidateQueries([
      TRANSACTION_LIST_QUERY_KEY,
      VAULT_LIST_QUERY_KEY,
    ]);
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
    },
    transactionsRequest: {
      ...homeDataRequest,
      transactions: homeDataRequest.data?.transactions?.data,
      loadingTransactions: homeDataRequest.isLoading,
    },
    navigate,
  };
};

export { useHome };
