import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { WorkspacesQueryKey } from '@/modules/core';
import {
  IWroskapceBalance,
  WorkspaceService,
} from '@/modules/workspace/services';

import { handleAssetsBalance } from '../utils/assets';
import { CookieName, CookiesConfig } from '@/config/cookies';

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
    enabled: !!CookiesConfig.getCookie(CookieName.ACCESS_TOKEN),
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
