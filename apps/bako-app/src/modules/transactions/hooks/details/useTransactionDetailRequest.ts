import { TransactionService } from '@bako-safe/services/modules/transaction';
import { useQuery } from '@tanstack/react-query';

const useTransactionDetailRequest = (transactionId: string) => {
  return useQuery({
    queryKey: ['transaction/details'],
    queryFn: () => TransactionService.getById(transactionId),
  });
};

export { useTransactionDetailRequest };
