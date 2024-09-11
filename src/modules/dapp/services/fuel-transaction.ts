import { BaseTransfer, Vault } from 'bakosafe';
import {
  getTransactionSummaryFromRequest,
  OperationTransactionAddress,
  OutputType,
  Provider,
  ScriptTransactionRequest,
  TransactionRequestLike,
} from 'fuels';

import { EthereumIcon } from '@/components';

export interface TransactionSimulateParams {
  transactionLike: TransactionRequestLike;
  providerUrl: string;
  configurable: string;
  version: string;
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
    providerUrl,
    configurable,
    version,
  }: TransactionSimulateParams) {
    const provider = await Provider.create(providerUrl);

    const vault = await Vault.create({
      configurable: JSON.parse(configurable),
      version,
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

    const incrementContractCallAsset =
      operations.length === 1 && !operations[0].assetsSent
        ? {
            to: operations[0].to,
            from: operations[0].from,
            amount: transactionLike.inputs?.[1]?.['amount'],
            assetId: transactionLike.inputs?.[1]?.['assetId'],
            name: 'Ethereum',
            slug: 'ETH',
            icon: EthereumIcon,
          }
        : null;

    return {
      fee: transactionRequest.maxFee.format(),
      operations: operations,
      incrementContractCallAsset,
    };
  }
}

export { FuelTransactionService };
