import { useFuel } from '@fuels/react';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import {
  CreateUserPayload,
  CreateUserResponse,
  Encoder,
  SignInResponse,
  UserService,
  UseSignInRequestParams,
} from '../services';
import { Address } from 'fuels';

const useCreateUserRequest = (
  options?: UseMutationOptions<CreateUserResponse, unknown, CreateUserPayload>,
) => {
  return useMutation({
    mutationKey: ['user/create'],
    mutationFn: UserService.create,
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
      const account: string | null | undefined = params.account || await fuel.currentAccount();
      
      const payload = {
        encoder: params.encoder || Encoder.FUEL,
        digest: params.code,
        signature:
          params.signature || (await fuel.signMessage(account!, params.code)),
        userAddress:
          params.encoder === Encoder.FUEL
            ? Address.fromString(account!).toB256()
            : account,
      };

      return UserService.signIn(payload);
    },
    ...options,
  });
};

export { useCreateUserRequest, useSignInRequest };
