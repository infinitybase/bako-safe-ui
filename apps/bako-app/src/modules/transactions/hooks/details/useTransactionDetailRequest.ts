import { useQuery } from '@tanstack/react-query';

import { transactionService } from '@/modules/services/services-initializer';

const useTransactionDetailRequest = (transactionId: string) => {
  return useQuery({
    queryKey: ['transaction/details'],
    queryFn: () => transactionService.getById(transactionId),
  });
};

export { useTransactionDetailRequest };
