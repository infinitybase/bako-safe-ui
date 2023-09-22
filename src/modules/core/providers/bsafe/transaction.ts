import { IPayloadTransfer, Transfer } from 'bsafe';
import { InputType, Predicate } from 'fuels';

import { AssetModel } from '@/modules';

export interface InstanceTransactionParams {
  predicate: Predicate<InputType[]>;
  assets: AssetModel[];
  witnesses: string[];
}

class TransactionHelpers {
  static async instanceTransaction(params: InstanceTransactionParams) {
    const { witnesses, assets, predicate } = params;

    const transferParams: IPayloadTransfer = {
      vault: {
        configurable: predicate,
      },
      assets: assets.map((asset) => ({
        assetId: asset.assetID,
        amount: asset.amount,
        to: asset.to,
      })),
      witnesses,
    };

    const transaction = new Transfer(transferParams);
    await transaction.instanceTransaction();

    return transaction;
  }
}

export { TransactionHelpers };
