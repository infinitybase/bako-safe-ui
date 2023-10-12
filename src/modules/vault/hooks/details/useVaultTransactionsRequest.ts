import { useQuery } from 'react-query';

import {
  SortOption,
  TransactionService,
} from '@/modules/transactions/services';

const useVaultTransactionsRequest = (id: string) => {
  return useQuery(
    ['transactions/byVault'],
    () =>
      TransactionService.getVaultTransactions({
        orderBy: 'created_at',
        sort: SortOption.DESC,
        predicateId: [id],
      }),
    {
      initialData: [],
    },
  );
};

export { useVaultTransactionsRequest };
