import { useQuery } from '@tanstack/react-query';

import { TransactionService } from '../../services';

const PENDING_TRANSACTIONS_QUERY_KEY = 'pending-transactions';

export type IUseTransactionSignaturePendingReturn = ReturnType<
  typeof useTransactionsSignaturePending
>;

const useTransactionsSignaturePending = (predicateId?: string[]) => {
  return useQuery({
    queryKey: [PENDING_TRANSACTIONS_QUERY_KEY],

    queryFn: () => {
      return TransactionService.getTransactionsSignaturePending(predicateId);
    },
    refetchOnWindowFocus: false,
    enabled: window.location.pathname != '/',
    refetchOnMount: false,
    staleTime: 500, // 500ms second to prevent request spam
  });
};

export { PENDING_TRANSACTIONS_QUERY_KEY, useTransactionsSignaturePending };
