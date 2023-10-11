import { useQuery } from 'react-query';

import { SortOption, TransactionService } from '../services';

const useUserTransactionsRequest = () => {
  return useQuery(
    ['transactions/byUser'],
    () =>
      TransactionService.getUserTransactions({
        // limit: 6,
        orderBy: 'created_at',
        sort: SortOption.DESC,
        allOfUser: true,
      }),
    {
      initialData: [],
    },
  );
};

export { useUserTransactionsRequest };
