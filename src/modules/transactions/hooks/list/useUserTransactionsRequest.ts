import { useQuery } from 'react-query';

import { useAuth } from '@/modules/auth/hooks/useAuth';

import { SortOption, TransactionService } from '../../services';

const USER_TRANSACTIONS_QUERY_KEY = 'transactions/byUser';

const useUserTransactionsRequest = (options?: { limit?: number }) => {
  const auth = useAuth();
  return useQuery(
    [USER_TRANSACTIONS_QUERY_KEY, auth.workspaces.current],
    () =>
      TransactionService.getUserTransactions({
        limit: options?.limit ?? undefined,
        orderBy: 'createdAt',
        sort: SortOption.DESC,
        allOfUser: true,
      }),
    {
      refetchOnWindowFocus: false,
    },
  );
};

export { USER_TRANSACTIONS_QUERY_KEY, useUserTransactionsRequest };
