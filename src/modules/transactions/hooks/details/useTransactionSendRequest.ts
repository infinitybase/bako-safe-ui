import { Vault } from 'bsafe';
import { useMutation, UseMutationOptions } from 'react-query';

import { BsafeProvider } from '@/modules/core';
import {
  GetTransactionResponse,
  TransactionService,
} from '@/modules/transactions/services';

export interface SendTransferParams {
  transaction: GetTransactionResponse;
  predicate: Vault;
}

const sendTransfer = async ({ transaction, predicate }: SendTransferParams) => {
  const transactionInstance = await BsafeProvider.instanceTransaction({
    predicate,
    assets: transaction.assets,
    witnesses: transaction.witnesses.map((witness) => witness.signature!),
  });

  const result = await transactionInstance.sendTransaction();

  if (result.status !== 'success') {
    throw new Error('Error to send transaction.');
  }

  return TransactionService.close(transaction?.id, {
    gasUsed: result.gasUsed,
    transactionResult: JSON.stringify(result),
  });
};

const useTransactionSendRequest = (
  options?: UseMutationOptions<
    GetTransactionResponse,
    unknown,
    SendTransferParams
  >,
) => {
  return useMutation('transaction/send', sendTransfer, options);
};

export { useTransactionSendRequest };
