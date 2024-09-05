import { useQuery } from '@tanstack/react-query';

import { TransactionService } from '@/modules/transactions/services';

export const TRANSACTION_HISTORY_QUERY_KEY = 'transaction/history';

const useTransactionHistoryRequest = (
  transactionId: string,
  predicateId: string,
) => {
  return useQuery({
    queryKey: [TRANSACTION_HISTORY_QUERY_KEY, transactionId, predicateId],
    queryFn: () =>
      TransactionService.getTransactionsHistory(transactionId, predicateId),
  });
};

export { useTransactionHistoryRequest };
