import {
  getTransactionSummaryFromRequest,
  OperationTransactionAddress,
  OutputType,
  Provider,
  ScriptTransactionRequest,
  TransactionRequestLike,
} from 'fuels';

import { instantiateVault } from '@/modules';

export interface TransactionSimulateParams {
  transactionLike: TransactionRequestLike;
  providerUrl: string;
  configurable: string;
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

const useFuelTransactionService = () => {
  const simulate = async ({
    transactionLike,
    providerUrl,
    configurable,
  }: TransactionSimulateParams) => {
    const provider = await Provider.create(providerUrl);

    const vaultInstance = await instantiateVault({
      provider,
      configurable: JSON.parse(configurable),
    });

    const transactionRequest = ScriptTransactionRequest.from(transactionLike);
    const transactionRequestResult =
      await vaultInstance.prepareTransaction(transactionRequest);

    const { operations } = await getTransactionSummaryFromRequest({
      transactionRequest: transactionRequestResult,
      provider,
    });

    return {
      fee: transactionRequest.maxFee.format(),
      operations: operations,
    };
  };

  return {
    simulate,
  };
};

export { useFuelTransactionService };
