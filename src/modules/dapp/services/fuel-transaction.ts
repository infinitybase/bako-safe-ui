import { BaseTransfer, Vault } from 'bakosafe';
import {
  getTransactionSummaryFromRequest,
  OperationTransactionAddress,
  OutputType,
  Provider,
  ScriptTransactionRequest,
  TransactionRequestLike,
} from 'fuels';

import { authCredentials } from '@/modules';

export interface TransactionSimulateParams {
  transactionLike: TransactionRequestLike;
  from: string;
  providerUrl: string;
}

export interface ISent {
  amount: string;
  assetId: string;
}

export interface IOutput {
  type: OutputType;
  assetId: string;
  amount: string;
  to: OperationTransactionAddress;
  from: OperationTransactionAddress;
  name?: string;
  calls?: string[];
  assetsSent?: ISent[];
}

export enum IFuelTransactionNames {
  CONTRACT_CALL = 'Contract call',
  TRANSFER_ASSET = 'Transfer asset',
}

class FuelTransactionService {
  static async simulate({
    transactionLike,
    from,
    providerUrl,
  }: TransactionSimulateParams) {
    const provider = await Provider.create(providerUrl);

    const auth = authCredentials();
    const vault = await Vault.create({
      predicateAddress: from,
      token: auth.token,
      address: auth.address,
    });

    let transactionRequest = ScriptTransactionRequest.from(transactionLike);
    transactionRequest = await BaseTransfer.prepareTransaction(
      vault,
      transactionRequest,
    );

    const { operations } = await getTransactionSummaryFromRequest({
      transactionRequest,
      provider,
    });

    return {
      fee: transactionRequest.maxFee.format(),
      operations: operations,
    };
  }
}

export { FuelTransactionService };
