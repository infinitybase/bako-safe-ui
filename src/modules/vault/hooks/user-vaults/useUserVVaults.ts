import { useNavigate } from 'react-router-dom';

import { useUserTransactionsRequest } from '@/modules/transactions';

import { useUserVaultRequest } from '../useUserVaultRequest';

const useUserVaults = () => {
  const navigate = useNavigate();
  const vaultsRequest = useUserVaultRequest();
  const transactionsRequest = useUserTransactionsRequest();

  return {
    navigate,
    vaultsRequest: {
      ...vaultsRequest,
      vaults: vaultsRequest.data,
      loadingVaults: vaultsRequest.isFetching,
    },
    transactionsRequest: {
      ...transactionsRequest,
      transactions: transactionsRequest.data,
      loadingTransactions: transactionsRequest.isLoading,
    },
  };
};

export { useUserVaults };
