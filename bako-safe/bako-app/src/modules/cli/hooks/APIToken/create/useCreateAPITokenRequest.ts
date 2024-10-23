import { useMutation } from '@tanstack/react-query';

import { APITokenService, CreateAPITokenPayload } from '@/modules/cli/services';

const useCreateAPITokenRequest = (predicateId: string) => {
  const { mutateAsync, isPending, isError } = useMutation({
    mutationKey: ['api-token/create', predicateId],
    mutationFn: async (data: CreateAPITokenPayload) => {
      return await APITokenService.create({ predicateId }, data);
    },
  });

  return {
    mutate: mutateAsync,
    isLoading: isPending,
    isError,
  };
};

export { useCreateAPITokenRequest };
