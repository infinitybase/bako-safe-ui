import { useQuery } from '@tanstack/react-query';

import { TransactionService } from '../../services';

const TRANSACTION_LIST_QUERY_KEY = 'transactions/list';

const useTransactionListRequest = (vaultId: string) => {
  return useQuery({
    queryKey: [TRANSACTION_LIST_QUERY_KEY, vaultId],
    queryFn: () =>
      TransactionService.getTransactions({
        predicateId: [vaultId],
      }),
    enabled: !!vaultId,
  });
};

export { TRANSACTION_LIST_QUERY_KEY, useTransactionListRequest };
