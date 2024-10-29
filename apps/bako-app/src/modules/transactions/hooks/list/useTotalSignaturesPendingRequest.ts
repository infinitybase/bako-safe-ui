import { TransactionService } from '@bako-safe/services/modules/transaction';
import { useQuery } from '@tanstack/react-query';
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
    enabled: window.location.pathname != '/',
    refetchOnWindowFocus: true,
    refetchOnMount: false,
    staleTime: 500, // 500ms second to prevent request spam
  });
};

export { PENDING_TRANSACTIONS_QUERY_KEY, useTransactionsSignaturePending };
