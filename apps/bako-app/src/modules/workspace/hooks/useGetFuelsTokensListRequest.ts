import { useQuery } from '@tanstack/react-query';

import { workspaceService } from '@/config/services-initializer';

const useGetFuelsTokensListRequest = () => {
  const { data: fuelsTokens, ...query } = useQuery({
    queryKey: ['fuel-tokens'],
    queryFn: () => workspaceService.getFuelTokensList(),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 500,
  });

  return {
    fuelsTokens,
    ...query,
  };
};

export { useGetFuelsTokensListRequest };
