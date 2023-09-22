import { Transaction } from './transaction.ts';

export interface Witness {
  id: string;
  signature?: string;
  account: string;
  transactionID: string;
  transaction: Transaction;
}
