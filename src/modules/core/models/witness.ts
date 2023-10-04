import { Transaction } from './transaction';

export interface Witness {
  id: string;
  signature?: string;
  account: string;
  transactionID: string;
  transaction: Transaction;
}
