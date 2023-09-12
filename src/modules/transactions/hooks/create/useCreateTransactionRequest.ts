import { InputType, Predicate } from 'fuels';
import { useMutation, UseMutationOptions } from 'react-query';

import { TransactionHelpers } from '@/modules';

import {
  CreateTransactionPayload,
  CreateTransactionResponse,
  TransactionService,
} from '../../services';

interface CreateTransactionParams {
  predicate: Predicate<InputType[]>;
  transaction: CreateTransactionPayload;
  predicateID: string;
}

const newTransaction = async (params: CreateTransactionParams) => {
  const { transaction, predicate, predicateID } = params;

  const instance = await TransactionHelpers.instanceTransaction({
    predicate,
    assets: transaction.assets,
    witnesses: [],
  });

  return TransactionService.create({
    ...transaction,
    predicateAddress: predicate.address.toString(),
    predicateID,
    hash: instance.getHashTxId(),
    txData: JSON.stringify(instance.getTransaction()),
  });
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
