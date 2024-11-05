import {
  DeleteNetworkPayload,
  DeleteNetworkResponse,
  NetworkQueryKey,
} from '@bako-safe/services';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { networkService } from '@/config/services-initializer';

const useDeleteNetworkRequest = (
  options?: UseMutationOptions<
    DeleteNetworkResponse,
    unknown,
    DeleteNetworkPayload
  >,
) => {
  return useMutation({
    mutationKey: [NetworkQueryKey.DELETE_NETWORK],
    mutationFn: networkService.delete,
    ...options,
  });
};

export { useDeleteNetworkRequest };
