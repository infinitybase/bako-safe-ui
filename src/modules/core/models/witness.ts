import { ITransaction } from 'bsafe';
export enum WitnessStatus {
  REJECTED = 'REJECTED',
  DONE = 'DONE',
  PENDING = 'PENDING',
}

export interface Witness {
  id: string;
  signature?: string;
  account: string;
  transactionID: string;
  transaction: ITransaction;
  status: WitnessStatus;
}
