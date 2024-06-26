import { useQuery } from 'react-query';

import { TransactionService } from '../../services';

const PENDING_TRANSACTIONS_QUERY_KEY = 'pending-transactions';

const useTransactionsSignaturePending = (predicateId?: string[]) => {
  return useQuery([PENDING_TRANSACTIONS_QUERY_KEY, predicateId], () => {
    return TransactionService.getTransactionsSignaturePending(predicateId);
  });
};

export { PENDING_TRANSACTIONS_QUERY_KEY, useTransactionsSignaturePending };
