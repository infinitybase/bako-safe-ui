import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useFuelAccount } from '@/modules';
import { useUserTransactionsRequest } from '@/modules/transactions/hooks';
import { useHomeVaultsRequest } from '@/modules/vault';

const useHome = () => {
  const navigate = useNavigate();
  const { account } = useFuelAccount();
  const vaultsPerPage = 8;
  const homeVaultsRequest = useHomeVaultsRequest(vaultsPerPage);
  const transactionsRequest = useUserTransactionsRequest({
    limit: 6,
  });
  const count = homeVaultsRequest?.data?.total ?? 0;

  useEffect(() => {
    document.getElementById('top')?.scrollIntoView();
  }, []);

  return {
    account,
    vaultsRequest: {
      ...homeVaultsRequest,
      vaults: {
        recentVaults: homeVaultsRequest.data?.data,
        vaultsMax: vaultsPerPage,
        extraCount: count <= vaultsPerPage ? 0 : count - vaultsPerPage,
      },
      loadingRecentVaults: homeVaultsRequest.isLoading,
    },
    transactionsRequest: {
      ...transactionsRequest,
      transactions: transactionsRequest.data?.slice(0, 6),
      loadingTransactions: transactionsRequest.isLoading,
    },
    navigate,
  };
};

export { useHome };
