import {
  SortOption,
  TransactionOrderBy,
  TransactionService,
} from '@services/modules/transaction';
import { useQuery } from '@tanstack/react-query';

import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

const USER_TRANSACTIONS_QUERY_KEY = 'transactions/byUser';

const useUserTransactionsRequest = (options?: { limit?: number }) => {
  const { authDetails } = useWorkspaceContext();
  return useQuery({
    queryKey: [
      USER_TRANSACTIONS_QUERY_KEY,
      authDetails.userInfos.workspace?.id,
    ],
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
