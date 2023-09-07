import { Predicate } from '@/modules/vault';

interface Assets {
  assetId: string;
  amount: string;
  to: string;
}

interface Signer {
  address: string;
  status: 'DONE' | 'PENDING';
}

interface CloseTransaction {
  gasUsed: string;
  transactionResult: string;
}
interface TransactionDetails {
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
interface Transaction {
  _id: string;
  witnesses: string[];
  predicateAddress: string;
  predicateID: string;
  name: string;
  assets: Assets[];
  to: string;
  hash: string;
  txData: string;
  status: 'PENDING' | 'DONE' | 'AWAIT';
  sendTime: string;
  gasUsed: string;
}

export interface SignerTransactionPayload {
  id: string;
  signer: string;
  predicateID: string;
}

export interface TransactionWithPredicate extends Transaction {
  predicate: Predicate;
}

export type GetTransactionResponse = Transaction;
export type GetTransactionByAddressesResponse = TransactionWithPredicate[];
export type CreateTransactionResponse = Transaction;
export type GetAllTransactionResponse = Transaction[];
export type GetTransactionByPredicateIdResponse = Transaction[];
export type CreateTransactionPayload = Omit<Transaction, '_id'>;
export type SignerTransactionResponse = Transaction;
export type TransferAsset = Assets;
export type TransferSignature = Signer;
export type CloseSender = CloseTransaction;
export type TransactionDetailUI = TransactionDetails;
