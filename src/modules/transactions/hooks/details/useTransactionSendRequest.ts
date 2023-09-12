import { InputType, Predicate } from 'fuels';
import { useMutation, UseMutationOptions } from 'react-query';

import { TransactionHelpers } from '@/modules';
import {
  GetTransactionResponse,
  TransactionService,
} from '@/modules/transactions/services';

export interface SendTransferParams {
  transaction: GetTransactionResponse;
  predicate: Predicate<InputType[]>;
}

const sendTransfer = async ({ transaction, predicate }: SendTransferParams) => {
  const transactionInstance = await TransactionHelpers.instanceTransaction({
    predicate,
    assets: transaction.assets,
    witnesses: transaction.witnesses,
  });

  const result = await transactionInstance.sendTransaction();

  if (result.status !== 'success') {
    throw new Error('Error to send transaction.');
  }

  return TransactionService.done(transaction?._id, {
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
