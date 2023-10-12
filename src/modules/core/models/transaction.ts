import { AssetModel } from './asset';
import { Predicate } from './predicate';
import { Witness } from './witness';

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
  predicateID: string;
  name: string;
  txData: string;
  hash: string;
  status: TransactionStatus;
  sendTime: string;
  gasUsed: string;
  resume: string;
  assets: AssetModel[];
  witnesses: Witness[];
  predicate: Predicate;
  createdAt: Date;
}
