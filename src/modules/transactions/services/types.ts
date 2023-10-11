import {
  AssetModel,
  IPagination,
  Transaction,
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
  predicateId?: string;
  to?: string;
  hash?: string;
  status?: TransactionStatus[] | string[];
  perPage?: number;
  page?: number;
}

export interface GetUserTransactionsParams {
  allOfUser?: boolean;
  orderBy?: string;
  sort?: SortOption;
  page?: number;
  perPage?: number;
  limit?: number;
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
  transactionResult: string;
}

export type GetTransactionResponse = Transaction;
export type GetTransactionsResponse = Transaction[];
export type GetTransactionsPaginationResponse = IPagination<Transaction>;
export type GetUserTransactionsResponse = Transaction[];
export type GetTransactionByAddressesResponse = Transaction[];
export type CreateTransactionResponse = Transaction;
export type SignerTransactionResponse = Transaction;
export type TransferAsset = AssetModel;
export type TransactionDetailUI = TransactionDetails;
