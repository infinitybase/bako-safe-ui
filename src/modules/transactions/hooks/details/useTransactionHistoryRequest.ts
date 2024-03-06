import { useQuery } from 'react-query';

import { TransactionService } from '@/modules/transactions/services';

const useTransactionHistoryRequest = (transactionId: string) => {
  return useQuery('transaction/history', () =>
    TransactionService.getTransactionsHistory(transactionId),
  );
};

export { useTransactionHistoryRequest };
