import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import {
  CheckNetworkPayload,
  CheckNetworkResponse,
  NetworkQueryKey,
  NetworkService,
} from '../services';

const useCheckNetworkRequest = (
  options?: UseMutationOptions<
    CheckNetworkResponse,
    unknown,
    CheckNetworkPayload
  >,
) => {
  return useMutation({
    mutationKey: [NetworkQueryKey.CHECK_NETWORK],
    mutationFn: NetworkService.check,
    ...options,
  });
};

export { useCheckNetworkRequest };
