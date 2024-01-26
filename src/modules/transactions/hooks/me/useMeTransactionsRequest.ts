import { useQuery } from 'react-query';

import { TransactionService } from '../../services';

const useMeTransactionsRequest = (predicateId: string) => {
  return useQuery(['transaction/by-predicateId', predicateId], async () =>
    predicateId
      ? TransactionService.getTransactions({ predicateId: [predicateId] })
      : [],
  );
};

export { useMeTransactionsRequest };
