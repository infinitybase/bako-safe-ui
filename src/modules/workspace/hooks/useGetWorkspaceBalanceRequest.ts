import { useQuery } from 'react-query';
import { UseQueryOptions } from 'react-query/types/react/types';

import { WorkspacesQueryKey } from '@/modules/core';
import {
  IWroskapceBalance,
  WorkspaceService,
} from '@/modules/workspace/services';

const useGetWorkspaceBalanceRequest = (
  options?: UseQueryOptions<
    IWroskapceBalance,
    unknown,
    IWroskapceBalance,
    string[]
  >,
) => {
  const { data, ...request } = useQuery(
    [WorkspacesQueryKey.DEFAULT, WorkspacesQueryKey.GET_BALANCE()],
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
      balance: data?.balance,
      balanceUSD: data?.balanceUSD,
      workspaceId: data?.workspaceId,
    },
    ...request,
  };
};

export { useGetWorkspaceBalanceRequest };
