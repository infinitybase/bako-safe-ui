import { useQuery } from 'react-query';

import { SortOption, TransactionService } from '../../services';

const USER_TRANSACTIONS_QUERY_KEY = 'transactions/byUser';

const useUserTransactionsRequest = () => {
  return useQuery(
    [USER_TRANSACTIONS_QUERY_KEY],
    () =>
      TransactionService.getUserTransactions({
        // limit: 20,
        orderBy: 'created_at',
        sort: SortOption.DESC,
        allOfUser: true,
      }),
    {
      refetchOnWindowFocus: false,
    },
  );
};

export { USER_TRANSACTIONS_QUERY_KEY, useUserTransactionsRequest };
