import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import {
  DeleteNetworkPayload,
  DeleteNetworkResponse,
  NetworkQueryKey,
  NetworkService,
} from '../services';

const useDeleteNetworkRequest = (
  options?: UseMutationOptions<
    DeleteNetworkResponse,
    unknown,
    DeleteNetworkPayload
  >,
) => {
  return useMutation({
    mutationKey: [NetworkQueryKey.DELETE_NETWORK],
    mutationFn: NetworkService.delete,
    ...options,
  });
};

export { useDeleteNetworkRequest };
