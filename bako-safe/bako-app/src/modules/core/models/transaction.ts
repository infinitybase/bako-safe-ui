import {
  IAsset,
  ITransactionResume,
  TransactionStatus as BakoSafeTransactionStatus,
} from 'bakosafe';

import { Predicate } from './predicate';

export enum TransactionStatus {
  AWAIT = 'AWAIT',
  DONE = 'DONE',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  ERROR = 'ERROR',
}

export interface TransactionState {
  isCompleted: boolean;
  isDeclined: boolean;
  isSigned: boolean;
  isPending: boolean;
  isReproved: boolean;
  isError: boolean;
}

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
