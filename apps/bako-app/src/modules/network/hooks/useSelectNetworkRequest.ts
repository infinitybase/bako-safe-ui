import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import {
  NetworkQueryKey,
  NetworkService,
  SelectNetworkPayload,
  SelectNetworkResponse,
} from '../services';

const useSelectNetworkRequest = (
  options?: UseMutationOptions<
    SelectNetworkResponse,
    unknown,
    SelectNetworkPayload
  >,
) => {
  return useMutation({
    mutationKey: [NetworkQueryKey.SELECT_NETWORK],
    mutationFn: NetworkService.selectNetwork,
    ...options,
  });
};

export { useSelectNetworkRequest };
