import { ITransaction, ITransactionResume } from 'bsafe';

import {
  AssetModel,
  IPagination,
  Predicate,
  TransactionStatus,
} from '@/modules/core';

export enum SortOption {
  ASC = 'ASC',
  DESC = 'DESC',
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

export interface GetTransactionParams {
  predicateId?: string[];
  to?: string;
  hash?: string;
  status?: TransactionStatus[] | string[];
  id?: string;
  perPage?: number;
  page?: number;
  orderBy?: string;
  sort?: SortOption;
  allOfUser?: boolean;
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

type TransactionWithVault = ITransaction & {
  predicate?: Predicate;
};

export type GetTransactionResponse = ITransaction;
export type GetTransactionsResponse = ITransaction[];
export type GetTransactionsPaginationResponse =
  IPagination<TransactionWithVault>;
export type GetUserTransactionsResponse = TransactionWithVault[];
export type GetVaultTransactionsResponse = ITransaction[];
export type GetTransactionByAddressesResponse = ITransaction[];
export type CreateTransactionResponse = ITransaction;
export type SignerTransactionResponse = ITransactionResume;
export type TransferAsset = AssetModel;
export type TransactionDetailUI = TransactionDetails;
