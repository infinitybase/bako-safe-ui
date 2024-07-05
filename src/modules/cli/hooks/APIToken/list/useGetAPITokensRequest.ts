import { useQuery } from 'react-query';

import { APITokenService } from '@/modules/cli/services';

export const GET_API_TOKENS_QUERY_KEY = 'api-token/get-all';

const useGetAPITokensRequest = (predicateId: string, hasPermission = false) => {
  return useQuery(
    ['api-token/get-all', predicateId, hasPermission],
    () =>
      APITokenService.getAll({
        predicateId,
      }),
    {
      enabled: hasPermission,
    },
  );
};

export { useGetAPITokensRequest };
