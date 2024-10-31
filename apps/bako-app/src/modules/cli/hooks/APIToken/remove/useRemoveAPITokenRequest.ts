import { DeleteAPITokenParams } from '@bako-safe/services/modules/cli';
import { useMutation } from '@tanstack/react-query';

import { apiTokenService } from '@/modules/services/services-initializer';

const useRemoveAPITokenRequest = () => {
  const { mutate, isError, isPending } = useMutation({
    mutationKey: ['api-token/remove'],
    mutationFn: (params: DeleteAPITokenParams) =>
      apiTokenService.delete({ ...params }),
  });

  return {
    mutate,
    isLoading: isPending,
    isError,
  };
};

export { useRemoveAPITokenRequest };
