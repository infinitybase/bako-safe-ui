import { useQuery } from '@tanstack/react-query';

import { TransactionService } from '@/modules/transactions/services';

const useTransactionHistoryRequest = (
  transactionId: string,
  predicateId: string,
) => {
  return useQuery({
    queryKey: ['transaction/history', transactionId, predicateId],
    queryFn: () =>
      TransactionService.getTransactionsHistory(transactionId, predicateId),
  });
};

export { useTransactionHistoryRequest };
