import { ITransaction, TransactionStatus } from 'bsafe';
import { randomBytes } from 'ethers';
import { useMemo } from 'react';

import { useFuelAccount } from '@/modules/auth';
import {
  HomeQueryKey,
  invalidateQueries,
  useWalletSignMessage,
} from '@/modules/core';
import { VAULT_TRANSACTIONS_QUERY_KEY } from '@/modules/vault';

import { useTransactionSend } from '../../providers';
import { useTransactionToast } from '../../providers/send/toast';
import {
  TRANSACTION_LIST_PAGINATION_QUERY_KEY,
  TRANSACTION_LIST_QUERY_KEY,
  USER_TRANSACTIONS_QUERY_KEY,
} from '../list';
import { useSignTransactionRequest } from './useSignTransactionRequest';

export interface SignTransactionParams {
  txId: string;
  transactionID: string;
  predicateID: string;
}

export interface UseSignTransactionOptions {
  transaction: ITransaction;
}

const useSignTransaction = (options: UseSignTransactionOptions) => {
  const toast = useTransactionToast();
  const { account } = useFuelAccount();
  const transactionSendContext = useTransactionSend();

  useMemo(() => {
    const transaction = options.transaction;

    const toSend =
      !!transaction &&
      transaction.status === TransactionStatus.PROCESS_ON_CHAIN &&
      !transactionSendContext.isExecuting(transaction);

    if (toSend) {
      transactionSendContext.executeTransaction(transaction);
    }
    return options.transaction;
  }, [options.transaction]);

  const refetetchTransactionList = () => {
    invalidateQueries([
      'bsafe',
      ...HomeQueryKey.FULL_DATA(),
      TRANSACTION_LIST_QUERY_KEY,
      USER_TRANSACTIONS_QUERY_KEY,
      VAULT_TRANSACTIONS_QUERY_KEY,
      TRANSACTION_LIST_PAGINATION_QUERY_KEY,
    ]);
  };

  const request = useSignTransactionRequest({
    onSuccess: () => refetetchTransactionList(),
    onError: () => {
      toast.generalError(randomBytes.toString(), 'Inválid signature');
    },
  });

  const signMessageRequest = useWalletSignMessage({
    onError: () => toast.error('Message sign rejected'),
  });

  const confirmTransaction = async () => {
    const signedMessage = await signMessageRequest.mutateAsync(
      options.transaction.hash,
    );
    await request.mutateAsync({
      account,
      confirm: true,
      signer: signedMessage,
      id: options.transaction.id,
    });
  };

  const retryTransaction = async () => {
    return transactionSendContext.executeTransaction(options.transaction);
  };

  const declineTransaction = async (transactionId: string) => {
    await request.mutateAsync({
      id: transactionId,
      confirm: false,
      account,
    });
  };

  return {
    request,
    signMessageRequest,
    confirmTransaction,
    retryTransaction,
    declineTransaction,
    isLoading:
      request.isLoading ||
      signMessageRequest.isLoading ||
      options.transaction.status === TransactionStatus.PROCESS_ON_CHAIN,
    isSuccess: request.isSuccess,
  };
};

export { useSignTransaction };
