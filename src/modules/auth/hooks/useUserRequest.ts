import { useMutation, UseMutationOptions } from 'react-query';

import { useFuel } from '@/modules';

import {
  CreateUserPayload,
  CreateUserResponse,
  Encoder,
  SignInPayload,
  SignInResponse,
  UserService,
} from '../services';

type UseSignInRequestParams = Omit<
  SignInPayload,
  'signature' | 'hash' | 'createdAt' | 'encoder'
>;

const useCreateUserRequest = (
  options?: UseMutationOptions<CreateUserResponse, unknown, CreateUserPayload>,
) => {
  return useMutation('user/create', UserService.create, options);
};

const useSignInRequest = (
  options?: UseMutationOptions<SignInResponse, unknown, UseSignInRequestParams>,
) => {
  const [fuel] = useFuel();

  return useMutation(
    'auth/sign-in',
    async (params: UseSignInRequestParams) => {
      const payload = {
        address: params.address,
        hash: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        encoder: Encoder.FUEL,
        provider: params.provider,
        user_id: params.user_id,
      };

      const signature = await fuel.signMessage(
        params.address,
        JSON.stringify(payload),
      );

      return UserService.signIn({ ...payload, signature });
    },
    options,
  );
};

export { useCreateUserRequest, useSignInRequest };
