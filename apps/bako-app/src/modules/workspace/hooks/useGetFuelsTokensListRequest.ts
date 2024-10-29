import { WorkspaceService } from '@bako-safe/services/modules/workspace';
import { useQuery } from '@tanstack/react-query';

const useGetFuelsTokensListRequest = () => {
  const { data: fuelsTokens, ...query } = useQuery({
    queryKey: ['fuel-tokens'],
    queryFn: () => WorkspaceService.getFuelTokensList(),
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
