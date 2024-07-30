import {
  MutationKey,
  QueryKey,
  useMutation,
  UseMutationOptions,
  useQuery,
} from '@tanstack/react-query';

import { CookieName, CookiesConfig } from '@/config/cookies';
import { authCredentials } from '@/modules/auth';

import {
  BakoSafeMutationFunction,
  BakoSafeQueryFunction,
  BakoSafeQueryOptions,
} from './types';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

const removeCredentialsWhenUnathorized = (error: any) => {
  const unauthorizedError = error.response?.status === 401;
  const auth = useWorkspaceContext();

  if (unauthorizedError) {
    auth.handlers?.logout?.();
    CookiesConfig.removeCookies([CookieName.ACCESS_TOKEN, CookieName.ADDRESS]);
  }
};

const useBakoSafeQuery = <
  TQueryFnData = unknown,
  TError = any,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryKey: TQueryKey,
  queryFn: BakoSafeQueryFunction<TQueryFnData, TQueryKey>,
  options?: Omit<
    BakoSafeQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    queryKey,
    queryFn: async (context) => {
      const credentials = authCredentials();

      try {
        return queryFn({
          ...context,
          auth: {
            token: credentials.token!,
            address: credentials.address!,
          },
        });
      } catch (error) {
        removeCredentialsWhenUnathorized(error);
        throw error;
      }
    },
    ...options,
  });
};

const useBakoSafeMutation = <
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown,
>(
  mutationKey: MutationKey,
  mutationFn: BakoSafeMutationFunction<TData, TVariables>,
  options?: Omit<
    UseMutationOptions<TData, TError, TVariables, TContext>,
    'mutationKey' | 'mutationFn'
  >,
) => {
  return useMutation({
    mutationKey,
    mutationFn: async (variables) => {
      const credentials = authCredentials();

      return await mutationFn({
        ...variables,
        auth: {
          token: credentials.token!,
          address: credentials.address!,
        },
      });
    },
    ...options,
  });
};

export { useBakoSafeMutation, useBakoSafeQuery };
