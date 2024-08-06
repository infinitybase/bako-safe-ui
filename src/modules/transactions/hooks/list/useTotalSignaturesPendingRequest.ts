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
    enabled: !!CookiesConfig.getCookie(CookieName.ACCESS_TOKEN),
  });
};

export { PENDING_TRANSACTIONS_QUERY_KEY, useTransactionsSignaturePending };
