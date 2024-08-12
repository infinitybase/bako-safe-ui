import { useQuery } from '@tanstack/react-query';
import { TransactionType } from 'bakosafe';

import { HomeQueryKey } from '@/modules/core/models';

import { HomeService } from '../services';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

const useHomeTransactionsRequest = (type: TransactionType | undefined) => {
  const { authDetails } = useWorkspaceContext();

  return useQuery({
    queryKey: [
      HomeQueryKey.HOME_WORKSPACE(authDetails.userInfos.workspace?.id),
      type,
    ],
    queryFn: () => HomeService.homeTransactions(type),
    refetchOnWindowFocus: true,
    enabled: window.location.pathname != '/',
    refetchOnMount: false,
    staleTime: 500, // 500ms second to prevent request spam
  });
};

export { useHomeTransactionsRequest };
