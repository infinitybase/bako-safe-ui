import {
  getTransactionSummaryFromRequest,
  OperationTransactionAddress,
  OutputType,
  Provider,
  TransactionRequestLike,
} from 'fuels';

import { Vault } from 'bakosafe';

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

    const vaultInstance = new Vault(provider, JSON.parse(configurable));

    const { tx } = await vaultInstance.BakoTransfer(transactionLike);

    const { operations } = await getTransactionSummaryFromRequest({
      transactionRequest: tx,
      provider,
    });

    return {
      fee: tx.maxFee.format(),
      operations: operations,
    };
  };

  return {
    simulate,
  };
};

export { useFuelTransactionService };
