import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { useFuelAccount } from '@/modules';
import { useUserTransactionsRequest } from '@/modules/transactions/hooks';
import { useUserVaultRequest } from '@/modules/vault';

const useHome = () => {
  const navigate = useNavigate();
  const { account } = useFuelAccount();
  const vaultsRequest = useUserVaultRequest();
  const transactionsRequest = useUserTransactionsRequest();

  const vaults = useMemo(() => {
    const max = 8;
    const userPredicates = vaultsRequest.data;
    const count = userPredicates?.length ?? 0;
    const extraCount = count <= max ? 0 : count - max;
    const recentVaults =
      count <= max ? userPredicates : userPredicates?.slice(0, max);

    const vaultsTransactions = userPredicates
      ?.map((predicate) => predicate.transactions)
      ?.reduce((acc, current) => [...acc, ...current], []);

    return {
      recentVaults,
      extraCount,
      vaultsMax: max,
      vaultsTransactions,
    };
  }, [vaultsRequest.data]);

  return {
    account,
    vaultsRequest: { ...vaultsRequest, vaults },
    transactionsRequest: {
      ...transactionsRequest,
      transactions: transactionsRequest.data?.slice(0, 6),
    },
    navigate,
  };
};

export { useHome };
