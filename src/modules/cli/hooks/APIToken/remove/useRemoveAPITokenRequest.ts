import { useMutation } from 'react-query';

import { APITokenService, DeleteAPITokenParams } from '@/modules/cli/services';

const useRemoveAPITokenRequest = () => {
  const { mutate, isError, isLoading } = useMutation(
    ['api-token/remove'],
    (params: DeleteAPITokenParams) => APITokenService.delete({ ...params }),
  );

  return {
    mutate,
    isLoading,
    isError,
  };
};

export { useRemoveAPITokenRequest };
