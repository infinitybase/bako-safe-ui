import {
  AddressType,
  bn,
  ContractTransactionRequestInput,
  InputType,
  OperationTransactionAddress,
  OutputType,
  Provider,
  ScriptTransactionRequest,
  TransactionRequestLike,
} from 'fuels';

import { NativeAssetId } from '@/modules/core';

export interface TransactionSimulateParams {
  providerUrl: string;
  transactionLike: TransactionRequestLike;
}
export interface IOutput {
  type: OutputType;
  assetId: string;
  amount: string;
  to: OperationTransactionAddress;
}

// export declare enum AddressType {
//   contract = 0,
//   account = 1,
// }

class FuelTransactionService {
  static async simulate({
    providerUrl,
    transactionLike,
  }: TransactionSimulateParams) {
    const provider = await Provider.create(providerUrl);
    const transactionRequest = ScriptTransactionRequest.from(transactionLike);
    const fee = await provider.getTransactionCost(transactionRequest);
    // console.log('auqi', transactionLike.outputs[0].type)
    //OutputType.Coin
    /**
     * tipos de output -> coin, contract
     *  - coin: deolve um valor para um endereço
     *  - contract: infos do contrato
     *
     *
     */

    const operations = transactionLike.outputs?.reduce(
      (acc: IOutput[], output) => {
        let operation;
        if (output.type === OutputType.Coin) {
          operation = {
            type: OutputType.Coin,
            amount: bn(output.amount).format(),
            to: {
              address: output.to.toString(),
              type: AddressType.account,
            },
            assetId: output.assetId.toString(),
          };
        } else if (output.type === OutputType.Contract) {
          if (!transactionLike.inputs)
            throw new Error('Invalid transaction inputs');
          const isContract =
            transactionLike.inputs[Number(output.inputIndex)].type ==
            InputType.Contract;
          if (!isContract) throw new Error('Invalid contract input');
          const input = transactionLike.inputs[
            Number(output.inputIndex)
          ] as ContractTransactionRequestInput;
          operation = {
            type: OutputType.Contract,
            amount: '0.00',
            to: {
              address: input.contractId.toString(),
              type: AddressType.contract,
            },
            assetId: NativeAssetId,
          };
        }
        if (operation) acc.push(operation);
        return acc;
      },
      [],
    );

    return {
      fee: fee.maxFee.format(),
      operations: operations,
    };
  }
}

export { FuelTransactionService };
