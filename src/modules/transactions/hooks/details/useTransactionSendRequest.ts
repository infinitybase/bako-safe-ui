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
  try {
    debugger;
    const transactionInstance = await BsafeProvider.instanceTransaction({
      predicate: Object.create(predicate),
      assets: transaction.assets,
      witnesses: transaction.witnesses
        .filter((witness) => !!witness.signature)
        .map((witness) => witness.signature!),
    });

    const result = await transactionInstance.sendTransaction();

    return TransactionService.close(transaction?.id, {
      gasUsed: result.gasUsed,
      transactionResult: JSON.stringify(result),
      hasError: result.status === 'failure',
    });
  } catch (e) {
    await TransactionService.close(transaction?.id, {
      gasUsed: '0',
      transactionResult: '{}',
      hasError: true,
    });

    throw e;
  }
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
