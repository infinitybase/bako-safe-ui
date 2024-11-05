import {
  CreateNetworkPayload,
  CreateNetworkResponse,
  NetworkQueryKey,
} from '@bako-safe/services';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { networkService } from '@/config/services-initializer';

const useCreateNetworkRequest = (
  options?: UseMutationOptions<
    CreateNetworkResponse,
    unknown,
    CreateNetworkPayload
  >,
) => {
  return useMutation({
    mutationKey: [NetworkQueryKey.CREATE_NETWORK],
    mutationFn: networkService.create,
    ...options,
  });
};

export { useCreateNetworkRequest };
