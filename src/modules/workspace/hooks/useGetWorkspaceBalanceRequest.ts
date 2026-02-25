import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { AssetMap, WorkspacesQueryKey } from '@/modules/core';
import {
  IWroskapceBalance,
  WorkspaceService,
} from '@/modules/workspace/services';

import { handleAssetsBalance } from '../utils/assets';

const useGetWorkspaceBalanceRequest = (
  currentWorkspace: string,
  assetsMaps: false | AssetMap | undefined,
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
    enabled: false,
    //   window.location.pathname != '/' && window.location.pathname != '/home',
    refetchOnMount: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    balance: {
      ...data,
      balanceUSD: data?.currentBalanceUSD,
      workspaceId: '',
      assetsBalance: handleAssetsBalance(data?.currentBalance, assetsMaps),
    },
    ...request,
  };
};

export { useGetWorkspaceBalanceRequest };
