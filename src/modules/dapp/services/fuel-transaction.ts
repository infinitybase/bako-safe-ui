import { BaseTransfer, Vault } from 'bakosafe';
import {
  getTransactionSummaryFromRequest,
  OperationTransactionAddress,
  OutputType,
  ScriptTransactionRequest,
  TransactionRequestLike,
} from 'fuels';

import { NativeAssetId } from '@/modules/core';
import { BaseTransfer, Vault } from 'bakosafe';
import { authCredentials } from '@/modules';

export interface TransactionSimulateParams {
  transactionLike: TransactionRequestLike;
  from: string;
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
  static async simulate({ transactionLike, from }: TransactionSimulateParams) {
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
            assetId: output.assetId.toString(),
            type: OutputType.Coin,
            amount: bn(output.amount).format(),
            to: {
              address: output.to.toString(),
              type: AddressType.account,
            },
            from: {
              type: AddressType.account,
              address: Address.fromString(from).toHexString(),
            },
            name: IFuelTransactionNames.TRANSFER_ASSET,
            assetsSent: [
              {
                amount: bn(output.amount).format(),
                assetId: output.assetId.toString(),
              },
            ],
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
            calls: [],
            assetId: NativeAssetId,
            type: OutputType.Contract,
            amount: '0.00',
            to: {
              address: input.contractId.toString(),
              type: AddressType.contract,
            },
            from: {
              type: AddressType.account,
              address: Address.fromString(from).toHexString(),
            },
            name: IFuelTransactionNames.CONTRACT_CALL,
          };
        }
        if (operation) acc.push(operation);
        return acc;
      },
      [],
    );

    return {
      fee: transactionRequest.maxFee.format(),
      operations: operations,
    };
  }
}

export { FuelTransactionService };
