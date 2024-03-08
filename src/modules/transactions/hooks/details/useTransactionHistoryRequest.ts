import { useQuery } from 'react-query';

import { TransactionService } from '@/modules/transactions/services';

const useTransactionHistoryRequest = (transactionId: string) => {
  return useQuery(['transaction/history', transactionId], () =>
    TransactionService.getTransactionsHistory(transactionId),
  );
};

export { useTransactionHistoryRequest };
