import { Transfer } from 'bsafe';
import { InputType, Predicate } from 'fuels';

import {
  CreateTransactionPayload,
  TransferAsset,
} from '@/modules/transactions/services';

export interface CreateTransactionParams {
  predicate: Predicate<InputType[]>;
  transaction: CreateTransactionPayload;
  predicateID: string;
}

export interface InstanceTransactionParams {
  predicate: Predicate<InputType[]>;
  assets: TransferAsset[];
  witnesses: string[];
}

class TransactionHelpers {
  static async instanceTransaction(params: InstanceTransactionParams) {
    const { witnesses, assets, predicate } = params;

    const transferParams = {
      vault: {
        configurable: predicate,
      },
      assets,
      witnesses,
    };

    const transaction = new Transfer(transferParams);
    await transaction.instanceTransaction();

    return transaction;
  }
}

export { TransactionHelpers };
