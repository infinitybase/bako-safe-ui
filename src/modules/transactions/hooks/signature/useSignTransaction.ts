import { useEffect, useMemo } from 'react';

import { useFuelAccount } from '@/modules/auth';
import {
  BsafeProvider,
  invalidateQueries,
  Transaction,
  TransactionStatus,
  useToast,
  useWalletSignMessage,
} from '@/modules/core';
import { VAULT_TRANSACTIONS_QUERY_KEY } from '@/modules/vault';

import { useTransactionSendRequest } from '../details';
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
  transaction: Transaction;
}

const useSignTransaction = (options: UseSignTransactionOptions) => {
  const toast = useToast();
  const { account } = useFuelAccount();

  const transaction = useMemo(() => {
    return options.transaction;
  }, [options.transaction]);

  const refetetchTransactionList = () =>
    invalidateQueries([
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

  const transactionSendRequest = useTransactionSendRequest({
    onSuccess: () => {
      toast.success('Transaction success.');
      refetetchTransactionList();
    },
    onError: () => {
      toast.error('Error send your transaction');
      refetetchTransactionList();
    },
  });

  const confirmTransaction = async (params: SignTransactionParams) => {
    const signedMessage = await signMessageRequest.mutateAsync(
      JSON.stringify(params),
    );
    await request.mutateAsync({
      account,
      confirm: true,
      signer: signedMessage,
      id: params.transactionID,
    });
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

    if (transaction.status === TransactionStatus.PENDING) {
      transactionSendRequest.mutate({
        transaction,
        predicate: BsafeProvider.instanceVault(transaction.predicate),
      });
    }
  }, [transaction]);

  return {
    request,
    signMessageRequest,
    confirmTransaction,
    declineTransaction,
    transactionSendRequest,
    isLoading:
      request.isLoading ||
      signMessageRequest.isLoading ||
      transactionSendRequest.isLoading,
    isSuccess: request.isSuccess,
  };
};

export { useSignTransaction };
