import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/modules/auth/hooks/useAuth';

import {
  SortOption,
  TransactionOrderBy,
  TransactionService,
} from '../../services';

const USER_TRANSACTIONS_QUERY_KEY = 'transactions/byUser';

const useUserTransactionsRequest = (options?: { limit?: number }) => {
  const auth = useAuth();
  return useQuery({
    queryKey: [USER_TRANSACTIONS_QUERY_KEY, auth.workspaces.current],
    queryFn: () =>
      TransactionService.getUserTransactions({
        limit: options?.limit ?? undefined,
        orderBy: TransactionOrderBy.CREATED_AT,
        sort: SortOption.DESC,
        allOfUser: true,
      }),
    refetchOnWindowFocus: false,
  });
};

export { USER_TRANSACTIONS_QUERY_KEY, useUserTransactionsRequest };
