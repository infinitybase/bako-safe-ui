import { TransactionStatus, TransactionType } from 'bakosafe';

export interface ITransaction {
  id: string;
  predicateId: string;
  predicateAddress: string;
  hash: string;
  status: TransactionStatus;
  name: string;
  resume: any;
  createdAt: string;
  updatedAt: string;
}

export interface IListTransactions {
  status?: TransactionStatus[];
  type?: TransactionType;
  page?: number;
  perPage?: number;
  orderBy?: string;
  sort?: 'ASC' | 'DESC';
}

export enum SortOptionTx {
  ASC = 'ASC',
  DESC = 'DESC',
}