import { useQuery } from '@tanstack/react-query';

import { transactionService } from '@/modules/services/services-initializer';
const PENDING_TRANSACTIONS_QUERY_KEY = 'pending-transactions';

export type IUseTransactionSignaturePendingReturn = ReturnType<
  typeof useTransactionsSignaturePending
>;

const useTransactionsSignaturePending = (predicateId?: string[]) => {
  return useQuery({
    queryKey: [PENDING_TRANSACTIONS_QUERY_KEY],
    queryFn: () => {
      return transactionService.getTransactionsSignaturePending(predicateId);
    },
    enabled: window.location.pathname != '/',
    refetchOnWindowFocus: true,
    refetchOnMount: false,
    staleTime: 500, // 500ms second to prevent request spam
  });
};

export { PENDING_TRANSACTIONS_QUERY_KEY, useTransactionsSignaturePending };
