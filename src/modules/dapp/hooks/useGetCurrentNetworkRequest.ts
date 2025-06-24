import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { DAppService } from '../services';

const useGetCurrentDappNetworkRequest = (
  options?: UseMutationOptions<string, unknown, string>,
) => {
  return useMutation({
    mutationKey: ['current/network/dapp'],
    mutationFn: DAppService.findNetworkBySessionId,
    ...options,
  });
};

export { useGetCurrentDappNetworkRequest };
