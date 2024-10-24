import { APITokenService, DeleteAPITokenParams } from '@services/modules/cli';
import { useMutation } from '@tanstack/react-query';

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
