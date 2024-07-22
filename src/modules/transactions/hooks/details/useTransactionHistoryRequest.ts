import { useQuery } from '@tanstack/react-query';

import { TransactionService } from '@/modules/transactions/services';

const useTransactionHistoryRequest = (transactionId: string) => {
  return useQuery({
    queryKey: ['transaction/history', transactionId],
    queryFn: () => TransactionService.getTransactionsHistory(transactionId),
  });
};

export { useTransactionHistoryRequest };
