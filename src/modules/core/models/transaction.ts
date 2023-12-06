import {
  TransactionStatus as BSAFETransactionStatus,
  IAsset,
  ITransactionResume,
} from 'bsafe';

import { AssetModel } from './asset';
import { Predicate } from './predicate';
import { IWitnesses } from 'bsafe';

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
  status: BSAFETransactionStatus;
  sendTime: string;
  gasUsed: string;
  resume: ITransactionResume;
  assets: IAsset[];
  witnesses: IWitnesses[];
  predicate: Predicate;
  createdAt: Date;
}
