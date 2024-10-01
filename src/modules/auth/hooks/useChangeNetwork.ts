import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import {
  ChangeNetworkPayload,
  ChangeNetworkResponse,
  UserService,
} from '../services';

enum NetworkQueryKey {
  CHANGE_NETWORK = 'change-network',
}

const useChangeNetworkRequest = (
  options?: UseMutationOptions<
    ChangeNetworkResponse,
    unknown,
    ChangeNetworkPayload
  >,
) => {
  return useMutation({
    mutationKey: [NetworkQueryKey.CHANGE_NETWORK],
    mutationFn: UserService.changeNetwork,
    ...options,
  });
};

export { useChangeNetworkRequest };
