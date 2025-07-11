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

export enum TransactionStatusWithOnOffRamp {
  PENDING_PROVIDER = 'pending_provider',
}

export interface TransactionState {
  isCompleted: boolean;
  isDeclined: boolean;
  isSigned: boolean;
  isPending: boolean;
  isReproved: boolean;
  isError: boolean;
  isCanceled: boolean;
  isPendingProvider: boolean;
}

export interface Transaction {
  id: string;
  predicateAdress: string;
  predicateId: string;
  name: string;
  txData: string;
  hash: string;
  status: BakoSafeTransactionStatus | TransactionStatusWithOnOffRamp;
  sendTime: string;
  gasUsed: string;
  resume: ITransactionResume;
  assets: IAsset[];
  predicate: Predicate;
  createdAt: Date;
  rampTransaction?: {
    provider: string;
    sourceAmount?: string;
    sourceCurrency?: string;
    destinationAmount?: string;
    destinationCurrency?: string;
  };
}
