import {
  QueryFunctionContext,
  QueryKey,
  UseQueryOptions,
} from '@tanstack/react-query';
import {
  IBakoSafeAuth,
  ITransactionResume,
  ITransactionSummary,
  ITransferAsset,
  TransactionStatus,
  TransactionType,
} from 'bakosafe';
import { Network, TransactionRequest } from 'fuels';

import { IRampTransaction } from '@/modules/core/models';
import {
  TransactionTypeBridge,
  TransactionTypeWithRamp,
} from '@/modules/transactions/services';

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

export interface ICreateTransactionPayload {
  predicateAddress: string; // ADDRESS OF PREDICATE
  name?: string;
  hash: string; // HASH OF TRANSACTION
  txData: TransactionRequest;
  status: TransactionStatus;
  assets: ITransferAsset[];
  sendTime?: Date;
  gasUsed?: string;
  network: Network;
}

export interface ITransaction extends ICreateTransactionPayload {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  predicateId: string;
  type: TransactionType | TransactionTypeWithRamp | TransactionTypeBridge;
  resume: ITransactionResume; // RESULT
  assets: ITransferAsset[];
  summary?: ITransactionSummary;
  rampTransaction?: IRampTransaction;
}

export enum SortOptionTx {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface GetTransactionParams {
  predicateId?: string[];
  to?: string;
  hash?: string;
  status?: TransactionStatus[];
  perPage?: number;
  page?: number;
  orderBy?: string;
  sort?: SortOptionTx;
}

export interface IListTransactions
  extends GetTransactionParams,
    Omit<GetTransactionParams, 'predicateId'> {}

export interface IPredicate extends IPredicatePayload {
  id: string;
  members: {
    id: string;
    avatar: string;
    address: string;
    nickname?: string;
  }[];
  owner: {
    id: string;
    address: string;
  };
  version: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPredicatePayload {
  name: string;
  description?: string;
  predicateAddress: string;
  minSigners: number;
  addresses: string[];
  configurable: string;
  provider: string;
  chainId?: number;
}
