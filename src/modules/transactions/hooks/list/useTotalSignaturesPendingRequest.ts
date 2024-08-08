import { useQuery } from '@tanstack/react-query';

import { TransactionService } from '../../services';
import { CookieName, CookiesConfig } from '@/config/cookies';

const PENDING_TRANSACTIONS_QUERY_KEY = 'pending-transactions';

const useTransactionsSignaturePending = () => {
  return useQuery({
    queryKey: [PENDING_TRANSACTIONS_QUERY_KEY],

    queryFn: () => {
      return TransactionService.getTransactionsSignaturePending();
    },
    refetchOnWindowFocus: false,
    enabled: window.location.pathname != '/',
    refetchOnMount: false,
    staleTime: 500, // 500ms second to prevent request spam
  });
};

export { PENDING_TRANSACTIONS_QUERY_KEY, useTransactionsSignaturePending };
