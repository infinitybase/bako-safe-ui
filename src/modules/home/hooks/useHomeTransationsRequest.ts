import { useInfiniteQuery } from '@tanstack/react-query';
import { TransactionType } from 'bakosafe';
import { useLocation } from 'react-router-dom';

import { HomeQueryKey } from '@/modules/core/models';
import { ITransactionStatusFilter } from '@/modules/transactions/services';

import { HomeService } from '../services';

const useHomeTransactionsRequest = ({
  workspaceId,
  status,
  type,
}: {
  workspaceId: string;
  type?: TransactionType;
  status?: ITransactionStatusFilter;
  offSetDb?: string | number;
}) => {
  const location = useLocation();

  return useInfiniteQuery({
    queryKey: HomeQueryKey.HOME_WORKSPACE(workspaceId, status, type),
    initialPageParam: { offsetDb: 0, offsetFuel: 0 },
    queryFn: ({ pageParam: { offsetDb, offsetFuel } }) =>
      HomeService.homeTransactions({
        type,
        status,
        perPage: 5,
        offsetDb,
        offsetFuel,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage?.data?.length === 0) {
        return undefined;
      }

      return { offsetDb: lastPage.offsetDb, offsetFuel: lastPage.offsetFuel };
    },
    refetchOnWindowFocus: false,
    enabled: !!workspaceId && location.pathname === '/home',
    refetchOnMount: false,
    // Socket events handle real-time updates, no need for aggressive refetch
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export { useHomeTransactionsRequest };
