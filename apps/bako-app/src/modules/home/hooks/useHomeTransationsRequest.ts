import { HomeService } from '@bako-safe/services/modules/home';
import { useQuery } from '@tanstack/react-query';

import { HomeQueryKey } from '../utils';

const useHomeTransactionsRequest = (workspaceId: string) => {
  return useQuery({
    queryKey: [HomeQueryKey.HOME_WORKSPACE(workspaceId)],
    queryFn: () => HomeService.homeTransactions(),
    refetchOnWindowFocus: true,
    enabled: window.location.pathname != '/',
    refetchOnMount: false,
    staleTime: 500, // 500ms second to prevent request spam
  });
};

export { useHomeTransactionsRequest };
