import { useQuery } from '@tanstack/react-query';

import { TransactionService } from '../../services';

const PENDING_TRANSACTIONS_QUERY_KEY = 'pending-transactions';

export type IUseTransactionSignaturePendingReturn = ReturnType<
  typeof useTransactionsSignaturePending
>;

const useTransactionsSignaturePending = (predicateId?: string[]) => {
  return useQuery({
    queryKey: [PENDING_TRANSACTIONS_QUERY_KEY, predicateId],
    queryFn: () => {
      return TransactionService.getTransactionsSignaturePending(predicateId);
    },
    enabled: window.location.pathname != '/',
    refetchOnWindowFocus: true,
    refetchOnMount: false,
    staleTime: 500, // 500ms second to prevent request spam
  });
};

export { PENDING_TRANSACTIONS_QUERY_KEY, useTransactionsSignaturePending };
