import { useQuery } from 'react-query';

import { useAuth } from '@/modules/auth/hooks';
import { HomeQueryKey } from '@/modules/core/models';

import { HomeService } from '../services';
import { TransactionType } from 'bakosafe';

const useHomeTransactionsRequest = (type: TransactionType | undefined) => {
  const auth = useAuth();

  return useQuery(
    [HomeQueryKey.HOME_WORKSPACE(auth.workspaces.current), type],
    () => HomeService.homeTransactions(type),
    {
      refetchOnWindowFocus: true,
    },
  );
};

export { useHomeTransactionsRequest };
