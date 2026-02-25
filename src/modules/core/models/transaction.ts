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

export interface IRampTransaction {
  provider: string;
  sourceAmount?: string;
  sourceCurrency?: string;
  destinationAmount?: string;
  destinationCurrency?: string;
  fiatAmountInUsd?: number;
  paymentMethod?: string;
  providerTransaction?: string;
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
  rampTransaction?: IRampTransaction;
}

export interface TransactionBridgeResume {
  id: string;
  status: string;
  createdDate: string;
  sourceToken: {
    to: string;
    amount: number;
    assetId: string;
    decimals: number;
  };
  sourceAddress: string;
  sourceNetwork: {
    logo: string;
    name: string;
    type: string;
    token: {
      logo: string;
      group: string;
      symbol: string;
      contract: string | null;
      decimals: number;
      precision: number;
      priceInUsd: number;
      sourceRank: number;
      listingDate: string;
      displayAsset: string;
      destinationRank: number;
    };
    chainId: string;
    nodeUrl: string;
    metadata: {
      listingDate: string;
      watchdogContract?: string;
      evmMulticallContract?: string;
    };
    sourceRank: number;
    displayName: string;
    depositMethods?: string[];
    destinationRank: number;
    accountExplorerTemplate: string;
    transactionExplorerTemplate: string;
  };
  destinationToken: {
    to: string;
    amount: number;
    assetId: string;
    decimals: number;
  };
  destinationNetwork: {
    logo: string;
    name: string;
    type: string;
    token: {
      logo: string;
      group: string;
      symbol: string;
      contract: string | null;
      decimals: number;
      precision: number;
      priceInUsd: number;
      sourceRank: number;
      listingDate: string;
      displayAsset: string;
      destinationRank: number;
    };
    chainId: string;
    nodeUrl: string;
    metadata: {
      listingDate: string;
      watchdogContract?: string;
      evmMulticallContract?: string;
    };
    sourceRank: number;
    displayName: string;
    depositMethods?: string[];
    destinationRank: number;
    accountExplorerTemplate: string;
    transactionExplorerTemplate: string;
  };
}
