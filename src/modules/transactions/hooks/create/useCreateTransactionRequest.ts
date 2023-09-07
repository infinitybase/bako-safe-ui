import {
  Address,
  arrayify,
  bn,
  hashTransaction,
  hexlify,
  InputType,
  Predicate,
  ScriptTransactionRequest,
  transactionRequestify,
} from 'fuels';
import { useMutation, UseMutationOptions } from 'react-query';

import { NativeAssetId } from '@/modules';

import {
  CreateTransactionPayload,
  CreateTransactionResponse,
  TransactionService,
  TransferAsset,
} from '../../services';

interface CreateTransactionParams {
  predicate: Predicate<InputType[]>;
  transaction: CreateTransactionPayload;
  predicateID: string;
}

interface InstanceTransactionParams {
  predicate: Predicate<InputType[]>;
  assets: TransferAsset[];
  witnesses: string[];
}

// TODO: Move to bsafe SDK
const instanceTransaction = async ({
  predicate,
  assets,
}: InstanceTransactionParams) => {
  // Create Transfer
  const request = new ScriptTransactionRequest();

  let totalCost = 0;
  !!assets &&
    assets.length > 0 &&
    assets.map((item: TransferAsset) => {
      request.addCoinOutput(
        Address.fromString(item.to),
        bn.parseUnits(item.amount),
        item.assetId,
      );
      totalCost += Number(parseFloat(item.amount).toFixed(5));
    });

  request.gasPrice = bn(1);
  request.gasLimit = bn(100_000);
  request.script = arrayify(
    '0x9000000447000000000000000000003c5dfcc00110fff3001a485000910000201a440000724000202849140072400020340004902400000047000000',
  );
  request.witnesses = [];

  const totalToSpend = bn()
    .add(request.gasPrice)
    .add(bn.parseUnits(totalCost.toString()));

  //todo: verify requiriments
  const coins = await predicate.getResourcesToSpend([
    {
      amount: totalToSpend,
      assetId: NativeAssetId,
    },
  ]);

  //Add coins -> todo: monitore this row with return feedback on error
  request.addResources(coins);

  // Add predicate data to the input
  request.inputs?.forEach((input) => {
    if (
      input.type === InputType.Coin &&
      hexlify(input.owner) === predicate.address.toB256()
    ) {
      // eslint-disable-next-line no-param-reassign
      input.predicate = arrayify(predicate.bytes);
      // eslint-disable-next-line no-param-reassign
      input.predicateData = arrayify(predicate.predicateData);
    }
  });

  // Request signature
  const txData = transactionRequestify(request);
  const txhash = hashTransaction(txData);
  const hash = txhash.slice(2);

  return {
    txData,
    hash,
  };
};

const newTransaction = async ({
  transaction,
  predicate,
  predicateID,
}: CreateTransactionParams) => {
  //hash
  const { txData, hash } = await instanceTransaction({
    predicate,
    assets: transaction.assets,
    witnesses: [],
  });

  const _transaction: CreateTransactionPayload = {
    ...transaction,
    predicateAddress: predicate.address.toString(),
    predicateID,
    hash,
    txData: JSON.stringify(txData),
  };

  const result = await TransactionService.create(_transaction);

  return result;
};

const useCreateTransactionRequest = (
  options?: UseMutationOptions<
    CreateTransactionResponse,
    unknown,
    CreateTransactionParams
  >,
) => {
  return useMutation('transaction/create', newTransaction, options);
};

export { useCreateTransactionRequest };
