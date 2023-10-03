import { useQuery } from 'react-query';

import { TransactionService } from '@/modules/transactions/services';

const useMeTransactionsRequest = (predicateId: string) => {
  return useQuery(['transaction/by-predicateId', predicateId], async () =>
    predicateId ? TransactionService.getTransactions({ predicateId }) : [],
  );
};

export { useMeTransactionsRequest };
