import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import {
  CreateNetworkPayload,
  CreateNetworkResponse,
  NetworkQueryKey,
  NetworkService,
} from '../services';

const useCreateNetworkRequest = (
  options?: UseMutationOptions<
    CreateNetworkResponse,
    unknown,
    CreateNetworkPayload
  >,
) => {
  return useMutation({
    mutationKey: [NetworkQueryKey.CREATE_NETWORK],
    mutationFn: NetworkService.create,
    ...options,
  });
};

export { useCreateNetworkRequest };
