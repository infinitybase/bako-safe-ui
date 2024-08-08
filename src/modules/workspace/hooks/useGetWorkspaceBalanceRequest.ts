import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { WorkspacesQueryKey } from '@/modules/core';
import {
  IWroskapceBalance,
  WorkspaceService,
} from '@/modules/workspace/services';

import { handleAssetsBalance } from '../utils/assets';

const useGetWorkspaceBalanceRequest = (
  currentWorkspace: string,
  options?: UseQueryOptions<
    IWroskapceBalance,
    unknown,
    IWroskapceBalance,
    string[]
  >,
) => {
  const { data, ...request } = useQuery({
    queryKey: WorkspacesQueryKey.GET_BALANCE(currentWorkspace),
    queryFn: () => WorkspaceService.getBalance(),
    ...options,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5, // 5 mins
    enabled:
      window.location.pathname != '/' && window.location.pathname != '/home',
    refetchOnMount: false,
    staleTime: 500, // 500ms second to prevent request spam
  });

  return {
    balance: {
      ...data,
      balanceUSD: data?.currentBalanceUSD,
      workspaceId: '',
      assetsBalance: handleAssetsBalance(data?.currentBalance),
    },
    ...request,
  };
};

export { useGetWorkspaceBalanceRequest };
