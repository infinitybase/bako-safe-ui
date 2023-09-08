import {
  hexlify,
  InputType,
  InputValue,
  Predicate,
  Provider,
  TransactionRequest,
  transactionRequestify,
  TransactionResponse,
} from 'fuels';
import { useMutation, UseMutationOptions } from 'react-query';

import {
  GetTransactionResponse,
  TransactionService,
} from '@/modules/transactions/services';

export interface SendTransferParams {
  transaction: GetTransactionResponse;
  predicate: Predicate<InputType[]>;
}

const sendTransaction = async (provider: Provider, tx: TransactionRequest) => {
  const encodedTransaction = hexlify(tx.toTransactionBytes());
  const {
    submit: { id: transactionId },
  } = await provider.operations.submit({ encodedTransaction });

  const response = new TransactionResponse(transactionId, provider);
  return response;
};

const instanceOldTransaction = async (
  transaction: GetTransactionResponse,
  predicate: Predicate<InputValue[]>,
) => {
  const txData = JSON.parse(transaction.txData);
  const _transaction = transactionRequestify(txData);

  _transaction.witnesses = transaction.witnesses;

  const provider: Provider = predicate.provider;

  const response = await sendTransaction(provider, _transaction);

  const result = await response.waitForResult();

  //todo: on success result, access endpoint close to update status and sendTime
  console.log(result.receipts);
  console.log(result.status);

  if (result.status?.type == 'success') {
    // todo: call function set done transaction
    const gasUsed = result.gasUsed.format();

    await TransactionService.done(transaction?._id, {
      gasUsed,
      transactionResult: JSON.stringify(result),
    });
  }
};

const sendTransfer = async ({ transaction, predicate }: SendTransferParams) => {
  if (!transaction?.predicateID) {
    alert(
      JSON.stringify({
        type: 'error',
        title: 'Failed send transaction',
      }),
    );
    return;
  }

  const predicateInstance = predicate;
  if (!predicateInstance) {
    return;
  }
  return instanceOldTransaction(transaction, predicateInstance);
};

const useTransactionSendRequest = (
  options?: UseMutationOptions<void, unknown, SendTransferParams>,
) => {
  return useMutation('transaction/send', sendTransfer, options);
};

export { useTransactionSendRequest };
