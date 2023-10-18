import { useMutation, UseMutationOptions } from 'react-query';

import { BsafeProvider } from '@/modules/core';
import {
  GetTransactionResponse,
  TransactionService,
} from '@/modules/transactions/services';
import { VaultService } from '@/modules/vault';

export interface SendTransferParams {
  transaction: GetTransactionResponse;
}

const sendTransfer = async ({ transaction }: SendTransferParams) => {
  try {
    const predicate = await VaultService.getById(transaction.predicateID);
    const transactionInstance = await BsafeProvider.instanceTransaction({
      predicate: BsafeProvider.instanceVault(predicate),
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
