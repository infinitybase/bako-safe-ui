import { APITokenService } from '@bako-safe/services/modules/cli';
import { useQuery } from '@tanstack/react-query';

export const GET_API_TOKENS_QUERY_KEY = 'api-token/get-all';

const useGetAPITokensRequest = (predicateId: string, hasPermission = false) => {
  return useQuery({
    queryKey: [GET_API_TOKENS_QUERY_KEY, predicateId, hasPermission],
    queryFn: () =>
      APITokenService.getAll({
        predicateId,
      }),
    enabled: !!predicateId && hasPermission,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

export { useGetAPITokensRequest };
