import {
  QueryFunctionContext,
  QueryKey,
  UseQueryOptions,
} from '@tanstack/react-query';
import { IBakoSafeAuth } from 'bakosafe';

export interface BakoSafeAuthParams {
  auth: IBakoSafeAuth;
}

export interface BakoSafeQueryContext<TQueryKey extends QueryKey = QueryKey>
  extends QueryFunctionContext<TQueryKey>,
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
