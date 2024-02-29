import { useQuery } from 'react-query';

import { TransactionService } from '../../services';

const TRANSACTION_LIST_QUERY_KEY = 'transactions/list';

const useTransactionListRequest = (vaultId: string) => {
  return useQuery(
    [TRANSACTION_LIST_QUERY_KEY, vaultId],
    () =>
      TransactionService.getTransactions({
        predicateId: [vaultId],
      }),
    { enabled: !!vaultId },
  );
};

export { TRANSACTION_LIST_QUERY_KEY, useTransactionListRequest };
