import { useQuery } from 'react-query';

import { SortOption, TransactionService } from '../../services';

const USER_TRANSACTIONS_QUERY_KEY = 'transactions/byUser';

const useUserTransactionsRequest = () => {
  return useQuery(
    [USER_TRANSACTIONS_QUERY_KEY],
    () =>
      TransactionService.getUserTransactions({
        // limit: 20,
        orderBy: 'createdAt',
        sort: SortOption.DESC,
        allOfUser: true,
      }),
    {
      initialData: [],
    },
  );
};

export { USER_TRANSACTIONS_QUERY_KEY, useUserTransactionsRequest };
