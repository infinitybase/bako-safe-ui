import { ITransaction, TransactionStatus } from 'bsafe';
import { useEffect, useMemo } from 'react';

import { useFuelAccount } from '@/modules/auth';
import {
  invalidateQueries,
  useToast,
  useWalletSignMessage,
} from '@/modules/core';
import { VAULT_TRANSACTIONS_QUERY_KEY } from '@/modules/vault';

import { useTransactionSend } from '../../providers';
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
  const toast = useToast();
  const { account } = useFuelAccount();
  const transactionSendContext = useTransactionSend();

  const transaction = useMemo(() => {
    // console.log(options.transaction);
    return options.transaction;
  }, [options.transaction]);

  const refetetchTransactionList = () =>
    invalidateQueries([
      'bsafe',
      TRANSACTION_LIST_QUERY_KEY,
      USER_TRANSACTIONS_QUERY_KEY,
      VAULT_TRANSACTIONS_QUERY_KEY,
      TRANSACTION_LIST_PAGINATION_QUERY_KEY,
    ]);

  const request = useSignTransactionRequest({
    onSuccess: refetetchTransactionList,
    onError: () => toast.error('Error on sign transaction'),
  });

  const signMessageRequest = useWalletSignMessage({
    onError: () => toast.error('Message sign rejected'),
  });

  const confirmTransaction = async (params: SignTransactionParams) => {
    const signedMessage = await signMessageRequest.mutateAsync(params.txId);
    await request.mutateAsync({
      account,
      confirm: true,
      signer: signedMessage,
      id: params.transactionID,
    });
  };

  const retryTransaction = async () => {
    return transactionSendContext.executeTransaction(transaction);
  };

  const declineTransaction = async (transactionId: string) => {
    await request.mutateAsync({
      id: transactionId,
      confirm: false,
      account,
    });
  };

  useEffect(() => {
    if (!transaction) return;

    if (transaction.status === TransactionStatus.PROCESS_ON_CHAIN) {
      transactionSendContext.executeTransaction(transaction);
    }
  }, [transaction]);

  return {
    request,
    signMessageRequest,
    confirmTransaction,
    retryTransaction,
    declineTransaction,
    isLoading:
      request.isLoading ||
      signMessageRequest.isLoading ||
      transaction.status === TransactionStatus.PROCESS_ON_CHAIN,
    isSuccess: request.isSuccess,
  };
};

export { useSignTransaction };
