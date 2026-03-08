import { Address, BN } from 'fuels';
import { TransactionStatus } from '@/modules/core/models';

export interface IListTransactions {
  predicateAddress?: Address;
  to?: Address;
  status?: TransactionStatus;
  dateStart?: string;
  dateEnd?: string;
}

export interface ITransactionResume {
  hash?: string;
  to?: Address[];
  assets: {
    assetId: string;
    amount: BN;
  }[];
  fee?: BN;
  gasUsed?: BN;
  operations: string[];
  witnesses: string[];
  status?: TransactionStatus;
  sendTime?: string;
  gasPrice?: BN;
}

export interface ITransaction {
  id: string;
  hash?: string;
  txData: ITransactionResume;
  predicateAddress: Address;
  name?: string;
  status: TransactionStatus;
  sendTime?: string;
  gasUsed?: string;
  gasPrice?: string;
  fee?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITransactionService {
  list(request: IListTransactions): Promise<ITransaction[]>;
  findByHash(hash: string): Promise<ITransaction>;
  create(transaction: Omit<ITransaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<ITransaction>;
  update(id: string, transaction: Partial<ITransaction>): Promise<ITransaction>;
  delete(id: string): Promise<void>;
}