import {
  MutationKey,
  QueryKey,
  useMutation,
  UseMutationOptions,
  useQuery,
} from '@tanstack/react-query';

import { CookieName, CookiesConfig } from '@/config/cookies';
import { authCredentials } from '@/modules/auth';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

import {
  BakoSafeMutationFunction,
  BakoSafeQueryFunction,
  BakoSafeQueryOptions,
} from './types';

const removeCredentialsWhenUnathorized = (error: any, logout?: () => void) => {
  const unauthorizedError = error.response?.status === 401;

  if (unauthorizedError) {
    logout?.();
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
  const { authDetails } = useWorkspaceContext();
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
        removeCredentialsWhenUnathorized(error, authDetails?.handlers?.logout);
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
