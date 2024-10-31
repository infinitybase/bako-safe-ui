import { CreateAPITokenPayload } from '@bako-safe/services/modules/cli';
import { useMutation } from '@tanstack/react-query';

import { apiTokenService } from '@/config/services-initializer';

const useCreateAPITokenRequest = (predicateId: string) => {
  const { mutateAsync, isPending, isError } = useMutation({
    mutationKey: ['api-token/create', predicateId],
    mutationFn: async (data: CreateAPITokenPayload) => {
      return await apiTokenService.create({ predicateId }, data);
    },
  });

  return {
    mutate: mutateAsync,
    isLoading: isPending,
    isError,
  };
};

export { useCreateAPITokenRequest };
