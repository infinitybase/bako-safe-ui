import { useQuery } from '@tanstack/react-query';

import { homeService } from '@/config/services-initializer';

import { HomeQueryKey } from '../utils';

const useHomeTransactionsRequest = (workspaceId: string) => {
  return useQuery({
    queryKey: [HomeQueryKey.HOME_WORKSPACE(workspaceId)],
    queryFn: () => homeService.homeTransactions(),
    refetchOnWindowFocus: true,
    enabled: window.location.pathname != '/',
    refetchOnMount: false,
    staleTime: 500, // 500ms second to prevent request spam
  });
};

export { useHomeTransactionsRequest };
