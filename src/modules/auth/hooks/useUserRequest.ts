import { useFuel } from '@fuels/react';
import { useMutation, UseMutationOptions } from 'react-query';

import {
  CreateUserPayload,
  CreateUserResponse,
  Encoder,
  SignInResponse,
  UserService,
  UseSignInRequestParams,
} from '../services';

const useCreateUserRequest = (
  options?: UseMutationOptions<CreateUserResponse, unknown, CreateUserPayload>,
) => {
  return useMutation('user/create', UserService.create, options);
};

const useSignInRequest = (
  options?: UseMutationOptions<SignInResponse, unknown, UseSignInRequestParams>,
) => {
  const { fuel } = useFuel();

  return useMutation(
    'auth/sign-in',
    async (params: UseSignInRequestParams) => {
      const account = await fuel.currentAccount();

      const payload = {
        encoder: Encoder.FUEL,
        digest: params.code,
        signature: await fuel.signMessage(account!, params.code),
      };

      return UserService.signIn(payload);
    },
    options,
  );
};

export { useCreateUserRequest, useSignInRequest };
