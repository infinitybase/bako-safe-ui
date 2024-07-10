import { useMutation } from 'react-query';

import { APITokenService, CreateAPITokenPayload } from '@/modules/cli/services';

const useCreateAPITokenRequest = (predicateId: string) => {
  const { mutateAsync, isLoading, isError } = useMutation(
    ['api-token/create', predicateId],
    async (data: CreateAPITokenPayload) => {
      return await APITokenService.create({ predicateId }, data);
    },
  );

  return {
    mutate: mutateAsync,
    isLoading,
    isError,
  };
};

export { useCreateAPITokenRequest };
