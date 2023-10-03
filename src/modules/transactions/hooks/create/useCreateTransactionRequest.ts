import { Vault } from 'bsafe';
import { useMutation, UseMutationOptions } from 'react-query';

import { BsafeProvider } from '@/modules/core';

import {
  CreateTransactionPayload,
  CreateTransactionResponse,
  TransactionService,
} from '../../services';

interface CreateTransactionParams {
  predicate: Vault;
  transaction: CreateTransactionPayload;
  predicateID: string;
}

const newTransaction = async (params: CreateTransactionParams) => {
  const { transaction, predicate, predicateID } = params;

  const instance = await BsafeProvider.instanceTransaction({
    predicate: Object.create(predicate),
    assets: transaction.assets,
    witnesses: [],
  });

  return TransactionService.create({
    predicateID,
    assets: transaction.assets,
    name: transaction.name,
    status: transaction.status,
    predicateAdress: predicate.address.toString(),
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
