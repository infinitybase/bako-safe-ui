import { IBakoSafeAuth } from 'bakosafe';
import { QueryFunctionContext, QueryKey } from 'react-query/types/core/types';
import { UseQueryOptions } from 'react-query/types/react/types';

export interface BsafeAuthParams {
  auth: IBakoSafeAuth;
}

export interface BsafeQueryContext<
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = any,
> extends QueryFunctionContext<TQueryKey, TPageParam>,
    BsafeAuthParams {}

export type BsafeQueryFunction<
  T = unknown,
  TQueryKey extends QueryKey = QueryKey,
> = (context: BsafeQueryContext<TQueryKey>) => T | Promise<T>;

export type BsafeMutationFunction<TData = unknown, TVariables = unknown> = (
  variables: TVariables & BsafeAuthParams,
) => Promise<TData>;

export interface BsafeQueryOptions<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> extends Omit<
    UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    'queryFn'
  > {
  queryFn?: BsafeQueryFunction<TQueryFnData, TQueryKey>;
}
