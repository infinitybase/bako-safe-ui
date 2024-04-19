import { IBakoSafeAuth } from 'bakosafe';
import { QueryFunctionContext, QueryKey } from 'react-query/types/core/types';
import { UseQueryOptions } from 'react-query/types/react/types';

export interface BakoSafeAuthParams {
  auth: IBakoSafeAuth;
}

export interface BakoSafeQueryContext<
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = any,
> extends QueryFunctionContext<TQueryKey, TPageParam>,
    BakoSafeAuthParams {}

export type BakoSafeQueryFunction<
  T = unknown,
  TQueryKey extends QueryKey = QueryKey,
> = (context: BakoSafeQueryContext<TQueryKey>) => T | Promise<T>;

export type BakoSafeMutationFunction<TData = unknown, TVariables = unknown> = (
  variables: TVariables & BakoSafeAuthParams,
) => Promise<TData>;

export interface BakoSafeQueryOptions<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> extends Omit<
    UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    'queryFn'
  > {
  queryFn?: BakoSafeQueryFunction<TQueryFnData, TQueryKey>;
}
