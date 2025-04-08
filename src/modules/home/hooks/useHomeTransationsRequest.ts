import { useQuery } from '@tanstack/react-query';

import { HomeQueryKey } from '@/modules/core/models';

import { HomeService } from '../services';
import { useLocation } from 'react-router-dom';

const useHomeTransactionsRequest = (workspaceId: string) => {
  const location = useLocation();

  return useQuery({
    queryKey: HomeQueryKey.HOME_WORKSPACE(workspaceId),
    queryFn: () => HomeService.homeTransactions(),
    refetchOnWindowFocus: true,
    enabled: !!workspaceId && location.pathname != '/',
    refetchOnMount: false,
    staleTime: 500, // 500ms second to prevent request spam
  });
};

export { useHomeTransactionsRequest };
