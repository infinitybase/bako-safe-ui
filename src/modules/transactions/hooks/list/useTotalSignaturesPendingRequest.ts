import { useQuery } from '@tanstack/react-query';

import { TransactionService } from '../../services';

const PENDING_TRANSACTIONS_QUERY_KEY = 'pending-transactions';

const useTransactionsSignaturePending = () => {
  return useQuery({
    queryKey: [PENDING_TRANSACTIONS_QUERY_KEY],

    queryFn: () => {
      return TransactionService.getTransactionsSignaturePending();
    },
    refetchOnWindowFocus: false,
  });
};

export { PENDING_TRANSACTIONS_QUERY_KEY, useTransactionsSignaturePending };
