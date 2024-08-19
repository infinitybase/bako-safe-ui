import {
  ITransaction,
  ITransactionResume,
  SortOptionTx,
  TransactionType,
  Vault,
} from 'bakosafe';

import { AssetModel, IPagination, TransactionStatus } from '@/modules/core';
import { PredicateAndWorkspace } from '@/modules/vault/services/methods';

export interface ITransactionPagination<T> {
  perPage: number;
  offsetDb: number;
  offsetFuel: number;
  data: T[];
}

export enum SortOption {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum TransactionHistoryType {
  FAILED = 'FAILED',
  CREATED = 'CREATED',
  SIGN = 'SIGNATURE',
  DECLINE = 'DECLINE',
  CANCEL = 'CANCEL',
  SEND = 'SEND',
}

export interface ITransactionHistory {
  type: TransactionHistoryType;
  date: string;
  owner: {
    id: string;
    avatar: string;
    address: string;
  };
}

export interface TransactionDetails {
  signers: {
    address: string;
    signed: boolean;
  }[];
  assigned: boolean;
  transfers: TransferAsset[];
  minSigners: number;
  totalSigners: number;
  isDone: boolean;
  fuelRedirect: string;
  isSigner: boolean;
}

export interface ITransactionPending {
  ofUser: number;
  transactionsBlocked: boolean;
}

export interface GetTransactionParams {
  predicateId?: string[];
  to?: string;
  hash?: string;
  status?: TransactionStatus[] | string[] | string;
  id?: string;
  perPage?: number;
  page?: number;
  orderBy?: string;
  sort?: SortOptionTx;
  allOfUser?: boolean;
  byMonth?: boolean;
  type?: TransactionType;
}

export interface GetTransactionsWithIncomingsParams {
  status?: TransactionStatus[] | string[] | string;
  predicateId?: string[];
  orderBy?: string;
  sort?: SortOptionTx;
  perPage?: number;
  byMonth?: boolean;
  type?: TransactionType;
  offsetDb?: number;
  offsetFuel?: number;
  id?: string;
}

export interface GetUserTransactionsParams {
  allOfUser?: boolean;
  orderBy?: string;
  sort?: SortOption;
  page?: number;
  perPage?: number;
  limit?: number;
}

export interface GetVaultTransactionsParams {
  predicateId?: string[];
  orderBy?: string;
  sort?: SortOption;
}

export interface SignerTransactionPayload {
  id: string;
  signer?: string;
  account: string;
  confirm: boolean;
}

export interface CreateTransactionPayload {
  predicateAdress: string;
  predicateID?: string;
  name: string;
  txData: string;
  hash: string;
  status: TransactionStatus;
  assets: AssetModel[];
}

export interface CloseTransactionPayload {
  gasUsed: string;
  hasError?: boolean;
  transactionResult: string;
}

export type TransactionWithVault = ITransaction & {
  predicate?: PredicateAndWorkspace;
  type: TransactionType;
};

export interface ITransactionWithType extends ITransaction {
  type: TransactionType;
}

export interface ITransactionsGroupedByMonth {
  monthYear: string;
  transactions: TransactionWithVault[];
}

export interface ResolveTransactionCostInput {
  assets: {
    to: string;
    amount: string;
    assetId: string;
  }[];
  vault: Vault;
}

export enum TransactionOrderBy {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export type GetTransactionResponse = ITransaction;
export type GetTransactionsResponse = TransactionWithVault[];
export type GetTransactionsPaginationResponse =
  IPagination<ITransactionsGroupedByMonth>;
export type GetTransactionsWithIncomingsPaginationResponse =
  ITransactionPagination<ITransactionsGroupedByMonth>;
export type GetUserTransactionsResponse = TransactionWithVault[];
export type GetVaultTransactionsResponse = ITransaction[];
export type GetTransactionByAddressesResponse = ITransaction[];
export type GetTransactionPendingResponse = ITransactionPending;
export type GetTransactionHistoryResponse = ITransactionHistory[];
export type CreateTransactionResponse = ITransaction;
export type SignerTransactionResponse = ITransactionResume;
export type TransferAsset = AssetModel;
export type TransactionDetailUI = TransactionDetails;
