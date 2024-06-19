import { useQuery } from 'react-query';
import { UseQueryOptions } from 'react-query/types/react/types';

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
  const { data, ...request } = useQuery(
    WorkspacesQueryKey.GET_BALANCE(current),
    () => WorkspaceService.getBalance(),
    {
      ...options,
      refetchOnWindowFocus: false,
      refetchInterval: 1000 * 60 * 5, // 5 mins
    },
  );

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
