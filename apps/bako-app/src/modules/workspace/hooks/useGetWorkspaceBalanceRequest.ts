import type { IWorkspaceBalance } from '@bako-safe/services/modules';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { workspaceService } from '@/config/services-initializer';
import type { AssetMap } from '@/modules/core';

import { WorkspacesQueryKey } from '../utils';
import { handleAssetsBalance } from '../utils/assets';

const useGetWorkspaceBalanceRequest = (
  currentWorkspace: string,
  assetsMaps: AssetMap | undefined,
  options?: UseQueryOptions<
    IWorkspaceBalance,
    unknown,
    IWorkspaceBalance,
    string[]
  >,
) => {
  const { data, ...request } = useQuery({
    queryKey: WorkspacesQueryKey.GET_BALANCE(currentWorkspace),
    queryFn: () => workspaceService.getBalance(),
    ...options,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5, // 5 mins
    enabled: false,
    //   window.location.pathname != '/' && window.location.pathname != '/home',
    refetchOnMount: false,
    staleTime: 500, // 500ms second to prevent request spam
  });

  return {
    balance: {
      ...data,
      balanceUSD: data?.currentBalanceUSD,
      workspaceId: '',
      assetsBalance: handleAssetsBalance(
        data?.currentBalance ?? [],
        assetsMaps ?? undefined,
      ),
    },
    ...request,
  };
};

export { useGetWorkspaceBalanceRequest };
