import { useQuery } from 'react-query';

import {
  SortOption,
  TransactionService,
} from '@/modules/transactions/services';

const VAULT_TRANSACTIONS_QUERY_KEY = 'transactions/byVault';

const useVaultTransactionsRequest = (id: string) => {
  return useQuery(
    [VAULT_TRANSACTIONS_QUERY_KEY, id],
    () =>
      TransactionService.getVaultTransactions({
        orderBy: 'created_at',
        sort: SortOption.DESC,
        predicateId: [id],
      }),
    {
      enabled: !!id,
      refetchOnWindowFocus: false,
    },
  );
};

export { useVaultTransactionsRequest, VAULT_TRANSACTIONS_QUERY_KEY };
