import { useQuery } from 'react-query';

import { TransactionService } from '@/modules/transactions/services';

const useTransactionDetailRequest = (transactionId: string) => {
  return useQuery('transaction/details', () =>
    TransactionService.getById(transactionId),
  );
};

export { useTransactionDetailRequest };
