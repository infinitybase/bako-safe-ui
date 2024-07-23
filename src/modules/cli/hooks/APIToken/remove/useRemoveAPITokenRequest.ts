import { useMutation } from '@tanstack/react-query';

import { APITokenService, DeleteAPITokenParams } from '@/modules/cli/services';

const useRemoveAPITokenRequest = () => {
  const { mutate, isError, isPending } = useMutation({
    mutationKey: ['api-token/remove'],
    mutationFn: (params: DeleteAPITokenParams) =>
      APITokenService.delete({ ...params }),
  });

  return {
    mutate,
    isLoading: isPending,
    isError,
  };
};

export { useRemoveAPITokenRequest };
