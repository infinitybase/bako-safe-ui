import { useQuery } from '@tanstack/react-query';

import { apiTokenService } from '@/config/services-initializer';

export const GET_API_TOKENS_QUERY_KEY = 'api-token/get-all';

const useGetAPITokensRequest = (predicateId: string, hasPermission = false) => {
  return useQuery({
    queryKey: [GET_API_TOKENS_QUERY_KEY, predicateId, hasPermission],
    queryFn: () =>
      apiTokenService.getAll({
        predicateId,
      }),
    enabled: !!predicateId && hasPermission,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

export { useGetAPITokensRequest };
