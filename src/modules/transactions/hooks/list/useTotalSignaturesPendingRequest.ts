import { useQuery } from 'react-query';

import { TransactionService } from '../../services';

const PENDING_TRANSACTIONS_QUERY_KEY = 'pending-transactions';

const useTransactionsSignaturePending = (predicateId?: string[]) => {
  return useQuery(
    [PENDING_TRANSACTIONS_QUERY_KEY, predicateId],
    () => {
      return TransactionService.getTransactionsSignaturePending(predicateId);
    },
    {
      // cacheTime: 1000 * 60 * 4,
      // staleTime: 1000 * 60 * 4,
      refetchInterval: 1000 * 60 * 4,
      refetchOnWindowFocus: true,
    },
  );
};

export { PENDING_TRANSACTIONS_QUERY_KEY, useTransactionsSignaturePending };
