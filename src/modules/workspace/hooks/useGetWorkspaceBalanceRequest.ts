import { useQuery } from 'react-query';
import { UseQueryOptions } from 'react-query/types/react/types';

import { WorkspacesQueryKey } from '@/modules/core';
import { WorkspaceService } from '@/modules/workspace/services';

const useGetWorkspaceBalanceRequest = (
  options?: UseQueryOptions<
    { balance: string; balanceUSD: string },
    unknown,
    { balance: string; balanceUSD: string },
    string[]
  >,
) => {
  const { data, ...request } = useQuery(
    WorkspacesQueryKey.GET_BALANCE(),
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
    },
    ...request,
  };
};

export { useGetWorkspaceBalanceRequest };
