import {
  TransactionStatus as BakoSafeTransactionStatus,
  ITransactionResume,
  IAsset,
  TransactionType,
  Vault,
  ITransferAsset,
  ITransactionSummary,
  TransactionStatus,
} from "bakosafe";
import { Network, Operation, Predicate, TransactionRequest } from "fuels";

import { PredicateAndWorkspace } from "@/modules/vault";
import { AssetModel, IPagination, SortOption } from "@/types";

export interface ITransactionPagination<T> {
  perPage: number;
  offsetDb: number;
  offsetFuel: number;
  data: T[];
}

export enum TransactionHistoryType {
  FAILED = "FAILED",
  CREATED = "CREATED",
  SIGN = "SIGNATURE",
  DECLINE = "DECLINE",
  CANCEL = "CANCEL",
  SEND = "SEND",
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

export interface GetUserTransactionsParams {
  allOfUser?: boolean;
  orderBy?: string;
  sort?: SortOption;
  page?: number;
  perPage?: number;
  limit?: number;
}
// export interface GetTransactionParams {
//   predicateId?: string[];
//   to?: string;
//   hash?: string;
//   status?: ITransactionStatusFilter;
//   id?: string;
//   perPage?: number;
//   page?: number;
//   orderBy?: string;
//   sort?: SortOption;
//   allOfUser?: boolean;
//   type?: TransactionType;
// }

export interface GetTransactionParams {
  predicateId?: string[];
  to?: string;
  hash?: string;
  status?: TransactionStatus[];
  perPage?: number;
  page?: number;
  orderBy?: string;
  sort?: SortOption;
}

export interface GetTransactionsWithIncomingsParams {
  status?: ITransactionStatusFilter;
  predicateId?: string[];
  orderBy?: string;
  sort?: SortOption;
  perPage?: number;
  type?: TransactionType;
  offsetDb?: number;
  offsetFuel?: number;
  id?: string;
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

// We not use this
// export interface CreateTransactionPayload {
//   predicateAdress: string;
//   predicateID?: string;
//   name: string;
//   txData: string;
//   hash: string;
//   status: TransactionStatus;
//   assets: AssetModel[];
// }

// We not use this
// export interface CloseTransactionPayload {
//   gasUsed: string;
//   hasError?: boolean;
//   transactionResult: string;
// }

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
  CREATED_AT = "createdAt",
  UPDATED_AT = "updatedAt",
}

// export enum TransactionStatus {
//   AWAIT = "AWAIT",
//   DONE = "DONE",
//   PENDING = "PENDING",
//   REJECTED = "REJECTED",
//   ERROR = "ERROR",
// }
export interface Transaction {
  id: string;
  predicateAdress: string;
  predicateId: string;
  name: string;
  txData: string;
  hash: string;
  status: BakoSafeTransactionStatus;
  sendTime: string;
  gasUsed: string;
  resume: ITransactionResume;
  assets: IAsset[];
  predicate: Predicate;
  createdAt: Date;
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
  type: TransactionType;
  resume: ITransactionResume; // RESULT
  assets: ITransferAsset[];
  summary?: ITransactionSummary;
}

export interface IListTransactions
  extends GetTransactionParams,
    Omit<GetTransactionParams, "predicateId"> {}

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
export type TransferAsset = AssetModel;
export type TransactionDetailUI = TransactionDetails;
