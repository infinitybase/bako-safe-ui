import { useQuery } from '@tanstack/react-query';
import { TransactionType } from 'bakosafe';

import { useAuth } from '@/modules/auth/hooks';
import { HomeQueryKey } from '@/modules/core/models';

import { HomeService } from '../services';

const useHomeTransactionsRequest = (type: TransactionType | undefined) => {
  const auth = useAuth();

  return useQuery({
    queryKey: [HomeQueryKey.HOME_WORKSPACE(auth.workspaces.current), type],
    queryFn: () => HomeService.homeTransactions(type),
    refetchOnWindowFocus: true,
  });
};

export { useHomeTransactionsRequest };
