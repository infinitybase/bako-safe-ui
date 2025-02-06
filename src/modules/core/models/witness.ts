import { ITransaction } from '../hooks/bakosafe/utils/types';

export enum WitnessStatus {
  REJECTED = 'REJECTED',
  DONE = 'DONE',
  PENDING = 'PENDING',
  CANCELED = 'CANCELED',
}

export interface Witness {
  id: string;
  signature?: string;
  account: string;
  transactionID: string;
  transaction: ITransaction;
  status: WitnessStatus;
}
