import { useQuery } from '@tanstack/react-query';

import { TransactionService } from '../../services';

const useMeTransactionsRequest = (predicateId: string) => {
  // Verificar o porque ta como predicateId, mas na verdade recebo o addrs do usuário
  return useQuery({
    queryKey: ['transaction/by-predicateId', predicateId],
    queryFn: async () =>
      predicateId
        ? TransactionService.getTransactions({ predicateId: [predicateId] })
        : [],
  });
};

export { useMeTransactionsRequest };
