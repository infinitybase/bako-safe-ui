import { AssetModel, Transaction, TransactionStatus } from '@/modules/core';

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
}

export interface SignerTransactionPayload {
  id: string;
  signer: string;
  account: string;
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
export type GetTransactionByAddressesResponse = Transaction[];
export type CreateTransactionResponse = Transaction;
export type SignerTransactionResponse = Transaction;
export type TransferAsset = AssetModel;
export type TransactionDetailUI = TransactionDetails;
