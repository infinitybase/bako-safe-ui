import { useQuery } from '@tanstack/react-query';

import { TransactionService } from '../../services';

const PENDING_TRANSACTIONS_QUERY_KEY = 'pending-transactions';

const useTransactionsSignaturePending = (predicateId?: string[]) => {
  return useQuery({
    queryKey: [PENDING_TRANSACTIONS_QUERY_KEY, predicateId],

    queryFn: () => {
      return TransactionService.getTransactionsSignaturePending(predicateId);
    },
    enabled: predicateId && !!predicateId[0],
    refetchOnWindowFocus: false,
  });
};

export { PENDING_TRANSACTIONS_QUERY_KEY, useTransactionsSignaturePending };
