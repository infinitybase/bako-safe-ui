import { useQuery } from '@tanstack/react-query';

import { TransactionService } from '../../services';

const useMeTransactionsRequest = (predicateId: string) => {
  return useQuery({
    queryKey: ['transaction/by-predicateId', predicateId],
    queryFn: async () =>
      predicateId
        ? TransactionService.getTransactions({ predicateId: [predicateId] })
        : [],
  });
};

export { useMeTransactionsRequest };
