import { TransactionStatus, TransactionType } from 'bakosafe';

import {
  ITransaction,
  SortOptionTx,
} from '@/modules/core/hooks/bakosafe/utils/types';
import { IPredicate } from '@/modules/core/models/predicate';
import { IWorkspace } from '@/modules/core/models/workspace';

export interface TransactionWithVault extends ITransaction {
  predicate: IPredicate & {
    workspace: IWorkspace;
  };
}

export enum TransactionOrderBy {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  NAME = 'name',
}

export interface GetTransactionParams {
  predicateId?: string[];
  status?: TransactionStatus[];
  to?: string[];
  hash?: string[];
  id?: string;
  type?: TransactionType;
  orderBy?: TransactionOrderBy;
  sort?: SortOptionTx;
  page: number;
  perPage: number;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface ITransactionResume {
  id: string;
  name: string;
  hash: string;
  txData: string;
  status: TransactionStatus;
  sendTime?: Date;
  gasUsed?: string;
  witnesses: {
    account: string;
    signature?: string;
  }[];
  predicate: {
    id: string;
    predicateAddress: string;
    minSigners: number;
    addresses: string[];
  };
}