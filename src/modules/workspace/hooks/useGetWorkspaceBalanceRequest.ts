import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { useAuth } from '@/modules/auth';
import { WorkspacesQueryKey } from '@/modules/core';
import {
  IWroskapceBalance,
  WorkspaceService,
} from '@/modules/workspace/services';

import { handleAssetsBalance } from '../utils/assets';

const useGetWorkspaceBalanceRequest = (
  options?: UseQueryOptions<
    IWroskapceBalance,
    unknown,
    IWroskapceBalance,
    string[]
  >,
) => {
  const {
    workspaces: { current },
  } = useAuth();
  const { data, ...request } = useQuery({
    queryKey: WorkspacesQueryKey.GET_BALANCE(current),
    queryFn: () => WorkspaceService.getBalance(),
    ...options,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5, // 5 mins
  });

  return {
    balance: {
      ...data,
      balanceUSD: data?.balanceUSD,
      workspaceId: data?.workspaceId,
      assetsBalance: handleAssetsBalance(data?.assetsBalance),
    },
    ...request,
  };
};

export { useGetWorkspaceBalanceRequest };
