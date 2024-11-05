import {
  NetworkQueryKey,
  SelectNetworkPayload,
  SelectNetworkResponse,
} from '@bako-safe/services';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { networkService } from '@/config/services-initializer';

const useSelectNetworkRequest = (
  options?: UseMutationOptions<
    SelectNetworkResponse,
    unknown,
    SelectNetworkPayload
  >,
) => {
  return useMutation({
    mutationKey: [NetworkQueryKey.SELECT_NETWORK],
    mutationFn: networkService.selectNetwork,
    ...options,
  });
};

export { useSelectNetworkRequest };
