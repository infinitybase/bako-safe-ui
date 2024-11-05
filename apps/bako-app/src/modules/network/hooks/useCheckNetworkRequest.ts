import {
  CheckNetworkPayload,
  CheckNetworkResponse,
  NetworkQueryKey,
} from '@bako-safe/services';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { networkService } from '@/config/services-initializer';

// import {
//   CheckNetworkPayload,
//   CheckNetworkResponse,
//   NetworkQueryKey,
//   NetworkService,
// } from '../services';

const useCheckNetworkRequest = (
  options?: UseMutationOptions<
    CheckNetworkResponse,
    unknown,
    CheckNetworkPayload
  >,
) => {
  return useMutation({
    mutationKey: [NetworkQueryKey.CHECK_NETWORK],
    mutationFn: networkService.check,
    ...options,
  });
};

export { useCheckNetworkRequest };
