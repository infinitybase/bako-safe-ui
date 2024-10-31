import {
  CreateUserPayload,
  CreateUserResponse,
  Encoder,
  SignInResponse,
  UseSignInRequestParams,
} from '@bako-safe/services';
import { useFuel } from '@fuels/react';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { Address } from 'fuels';

import { userService } from '@/modules/services/services-initializer';

const useCreateUserRequest = (
  options?: UseMutationOptions<CreateUserResponse, unknown, CreateUserPayload>,
) => {
  return useMutation({
    mutationKey: ['user/create'],
    mutationFn: userService.create,
    ...options,
  });
};

const useSignInRequest = (
  options?: UseMutationOptions<SignInResponse, unknown, UseSignInRequestParams>,
) => {
  const { fuel } = useFuel();

  return useMutation({
    mutationKey: ['auth/sign-in'],
    mutationFn: async (params: UseSignInRequestParams) => {
      const account = await fuel.currentAccount();

      const payload = {
        encoder: Encoder.FUEL,
        digest: params.code,
        signature: await fuel.signMessage(account!, params.code),
        userAddress: Address.fromString(account!).toB256(),
      };

      return userService.signIn(payload);
    },
    ...options,
  });
};

export { useCreateUserRequest, useSignInRequest };
