import { useQuery } from '@tanstack/react-query';

import { TransactionService } from '@/modules/transactions/services';

const useTransactionDetailRequest = (transactionId: string) => {
  return useQuery({
    queryKey: ['transaction/details'],
    queryFn: () => TransactionService.getById(transactionId),
  });
};

export { useTransactionDetailRequest };
