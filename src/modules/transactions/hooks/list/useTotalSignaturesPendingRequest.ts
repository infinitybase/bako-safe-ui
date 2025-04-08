import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { TransactionService } from '../../services';

const PENDING_TRANSACTIONS_QUERY_KEY = 'pending-transactions';

export type IUseTransactionSignaturePendingReturn = ReturnType<
  typeof useTransactionsSignaturePending
>;

const useTransactionsSignaturePending = (predicateId?: string[]) => {
  const queryKey = useMemo(
    () => [PENDING_TRANSACTIONS_QUERY_KEY, predicateId],
    [predicateId],
  );
  const query = useQuery({
    queryKey,
    queryFn: () => {
      return TransactionService.getTransactionsSignaturePending(predicateId);
    },
    enabled: window.location.pathname != '/',
    refetchOnWindowFocus: true,
    refetchOnMount: false,
    staleTime: 500, // 500ms second to prevent request spam
  });
  return {
    ...query,
    queryKey,
  };
};

export { PENDING_TRANSACTIONS_QUERY_KEY, useTransactionsSignaturePending };
