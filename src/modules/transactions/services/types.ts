import { ITransactionResume, TransactionType, Vault } from 'bakosafe';
import { Operation } from 'fuels';

import { AssetModel, IPagination, TransactionStatus } from '@/modules/core';
import {
  ITransaction,
  SortOptionTx,
} from '@/modules/core/hooks/bakosafe/utils/types';
import { PredicateAndWorkspace } from '@/modules/vault';

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

export type ITransactionStatusFilter = TransactionStatus[] | string[] | string;

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
  status?: ITransactionStatusFilter;
  id?: string;
  perPage?: number;
  page?: number;
  orderBy?: string;
  sort?: SortOptionTx;
  allOfUser?: boolean;
  type?: TransactionType;
}

export interface GetTransactionsWithIncomingsParams {
  status?: ITransactionStatusFilter;
  predicateId?: string[];
  orderBy?: string;
  sort?: SortOptionTx;
  perPage?: number;
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
  hash?: string;
  id?: string;
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

export type OperationWithAssets = Operation & {
  assetId?: string;
  amount?: string;
  from?: { address?: string };
  to?: { address?: string };
  assetsSent?: { assetId?: string; amount?: string }[];
};

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

export interface ITransactionQueryOldData {
  currentPage: number;
  data: ITransaction[];
  nextPage: number;
  perPage: number;
  prevPage: number;
  total: number;
  totalPages: number;
}

export interface ITransactionQueryUpdatePage {
  page?: number;
  perPage?: number;
  data: ITransaction[];
}

export interface ITransactionInfinityQueryData {
  pageParams: ITransactionQueryUpdatePage;
  pages: ITransactionQueryUpdatePage[];
}

export interface ITransactionReactQueryUpdate {
  type: '[UPDATED]' | '[CREATED]';
  transaction: ITransaction;
  history: ITransactionHistory;
}

export type GetTransactionResponse = ITransaction;
export type GetTransactionsResponse = TransactionWithVault[];
export type GetTransactionsPaginationResponse =
  IPagination<TransactionWithVault>;
export type GetTransactionsWithIncomingsPaginationResponse =
  ITransactionPagination<TransactionWithVault>;
export type GetUserTransactionsResponse = TransactionWithVault[];
export type GetVaultTransactionsResponse = ITransaction[];
export type GetTransactionByAddressesResponse = ITransaction[];
export type GetTransactionPendingResponse = ITransactionPending;
export type GetTransactionHistoryResponse = ITransactionHistory[];
export type CreateTransactionResponse = ITransaction;
export type SignerTransactionResponse = ITransactionResume;
export type CancelTransactionResponse = ITransactionResume;
export type TransferAsset = AssetModel;
export type TransactionDetailUI = TransactionDetails;
